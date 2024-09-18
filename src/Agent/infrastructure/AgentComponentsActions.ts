import { AttachmentBuilder, ButtonInteraction, User } from "discord.js"
import { EmbedResult } from "../../shared/intraestructure/EmbedResult.js"
import { InlineBlockText } from "../../shared/utils/textFormating.js"
import { AgentComponentActionsEnums as Actions } from "../domain/AgentComponentActionsEnums.js"
import { GuildNotFoundError, UnknownButtonInteractionError, UnknownInteractionError } from "../../shared/domain/Exceptions.js"
import { IComponentActionData } from "../../shared/domain/IComponentActionData.js"
import { IComponentAction } from "../../shared/domain/IComponentAction.js"
import { ICasualTransactionInput } from "../../CasualTransaction/domain/ICasualTransactionInput.js"
import { createAdminSuccessPaymentEmbed } from "./embeds/AdminSuccessPaymentEmbed.js"
import { IDMConversactionInput } from "../../DMConversaction/domain/IDMConversactionInput.js"
import { logger } from "../../shared/utils/logger.js"
import { getAttachmentFromBuffer } from "../../shared/utils/AttachmentBuffer.js"
import { MemberNotFoundError } from "../../Member/domain/MemberExceptions.js"
import { RoleNotFoundError } from "../../Role/domain/RoleException.js"
import { CasualTransactionNotFoundError } from "../../CasualTransaction/domain/CasualTransactionExceptions.js"
import { CasualTransactionState } from "../../CasualTransaction/domain/CasualTransactionStateEnums.js"
import { DMConversactionState } from "../../DMConversaction/domain/DMConversactionStateEnums.js"
import { createAdminFailedPaymentEmbed } from "./embeds/AdminFailedPaymentEmbed.js"
import { createAdminFakePaymentEmbed } from "./embeds/AdminFakePaymentEmbed.js"
import { createUserPaymentSucessEmbed } from "./embeds/UserPaymentSucessEmbed.js"
import { createUserPaymentFailedEmbed } from "./embeds/UserPaymentFailedEmbed.js"
import { createUserPaymentFakeEmbed } from "./embeds/UserPaymentFakeEmbed.js"
import { CustomComponentID } from "../../shared/domain/CustomComponentID.js"
import { DMConversactionUpdatableMessageNotFoundError } from "../../DMConversaction/domain/DMConversactionExceptions.js"
import { IRoleProductInput } from "../../RoleProduct/domain/IRoleProductInput.js"
import { ICreditProductInput } from "../../CreditProduct/domain/ICreditProductInput.js"
import { IMemberInput } from "../../Member/domain/IMemberInput.js"
import { ICreditWalletInput } from "../../CreditWallet/domain/ICreditWalletInput.js"
import { ICasualTransaction } from "../../CasualTransaction/domain/ICasualTransaction.js"

export class AgentComponentsActions implements IComponentAction {
    public id: string

    constructor (
        private DMConversactionService: IDMConversactionInput,
        private casualTransactionService: ICasualTransactionInput,
        private roleProductService: IRoleProductInput,
        private creditProductService: ICreditProductInput,
        private creditWalletService: ICreditWalletInput
    ) {
        this.id = CustomComponentID.AGENT
    }

    execute = async (interaction: ButtonInteraction, data: IComponentActionData) => {
        try {
            if (interaction.isButton()) {
                if (data.action == Actions.MARK_INCOMING_PAYMENT_AS_SUCCESS) {
                    return await this.markAsSuccess(interaction, data)
                }

                if (data.action == Actions.MARK_INCOMING_PAYMENT_AS_FAKE) {
                    return await this.markAsFake(interaction, data)
                }

                if (data.action == Actions.MARK_INCOMING_PAYMENT_AS_FAILED) {
                    return await this.markAsFailed(interaction, data)
                }
                throw new UnknownButtonInteractionError()
            }
            throw new UnknownInteractionError()
        }
        catch (e) {
            return await EmbedResult.fail({description: InlineBlockText(String(e)), interaction})
        }
    }

    markAsSuccess = async (interaction: ButtonInteraction, data: IComponentActionData) => {
        return await this._markPayment(interaction, data, "SUCCESS")
    }

    markAsFailed = async (interaction: ButtonInteraction, data: IComponentActionData) => {
        return await this._markPayment(interaction, data, "FAILED")
    }

    markAsFake = async (interaction: ButtonInteraction, data: IComponentActionData) => {
        return await this._markPayment(interaction, data, "FAKE")
    }

    _markPayment = async (interaction: ButtonInteraction, data: IComponentActionData, markAs: "SUCCESS" | "FAILED" | "FAKE") => {
        try {
            await interaction.deferUpdate();

            const DMConversactionId = <string>data.values.DMConversactionId

            const DMConversactionResult = await this.DMConversactionService.get(DMConversactionId)
            if (!DMConversactionResult.isSuccess()) return DMConversactionResult.error

            const DMConversaction = DMConversactionResult.value

            const casualTransactionId = DMConversaction.casualTransactionId
            if (!casualTransactionId) throw new CasualTransactionNotFoundError()

            const casualTransactionResult = await this.casualTransactionService.get(casualTransactionId)
            if (!casualTransactionResult.isSuccess()) return casualTransactionResult.error
    
            const casualTransaction = casualTransactionResult.value

            if (casualTransaction.state != CasualTransactionState.PENDING) {
                throw new Error(`This transaction was marked as ${casualTransaction.state} already.`)
            }

            const memberId = casualTransaction.memberId
            const guildId = casualTransaction.guildId
            const updatableMessageId = DMConversaction.updatableMessageId
            const productId = casualTransaction.productId

            const guild = interaction.client.guilds.cache.get(guildId)
            if (!guild) throw new GuildNotFoundError()

            const member = await guild.members.fetch(memberId)
            if (!member) throw new MemberNotFoundError()

            const user = <User>member.user

            if (!updatableMessageId) throw new DMConversactionUpdatableMessageNotFoundError()
            
            const dmChannel = await user.createDM()
            const DMConversactionUpdatableMessage = await dmChannel.messages.fetch(updatableMessageId)
                
            const image = await getAttachmentFromBuffer(casualTransaction.invoices[0])


            let createAdminEmbedResponse ;
            let userEmbedResponse;

            if (markAs == "SUCCESS") {
                casualTransaction.state = CasualTransactionState.SUCCESS
                createAdminEmbedResponse = createAdminSuccessPaymentEmbed       
                userEmbedResponse = createUserPaymentSucessEmbed

                if (casualTransaction.productType == 'Credit') {
                    const creditProductResult = await this.creditProductService.get(productId)
                    if (!creditProductResult.isSuccess()) return creditProductResult.error

                    const creditProduct = creditProductResult.value

                    const totalCreditResult = await this.creditWalletService.increment(memberId, guildId, creditProduct.credits)
                    if (!totalCreditResult.isSuccess()) return totalCreditResult.error

                    const totalCredit = totalCreditResult.value

                    logger.info(`The member ${member.user.username} (${memberId}) bought ${creditProduct.credits} credits for $${creditProduct.price} USD, their total credits is now ${totalCredit} credits.`)
                }
                else {
                    const roleProductResult = await this.roleProductService.get(productId)
                    if (!roleProductResult.isSuccess()) return roleProductResult.error

                    const role = await guild.roles.fetch(productId)
                    if (!role) throw new RoleNotFoundError()

                    await member.roles.add(role)

                    logger.info(`The member ${member.user.username} (${memberId}) got the role ${role.name} (${role.id})`)
                }
            }
            else if (markAs == "FAILED") {
                casualTransaction.state = CasualTransactionState.FAILED
                createAdminEmbedResponse = createAdminFailedPaymentEmbed
                userEmbedResponse = createUserPaymentFailedEmbed
            }
            else {
                casualTransaction.state = CasualTransactionState.FAKE
                createAdminEmbedResponse = createAdminFakePaymentEmbed
                userEmbedResponse = createUserPaymentFakeEmbed
            }

            DMConversaction.state = DMConversactionState.CLOSED

            const casualTransactionUpdatedResult = await this.casualTransactionService.update(casualTransaction)
            if (!casualTransactionUpdatedResult.isSuccess()) return casualTransactionUpdatedResult.error

            const DMConversactionUpdatedResult = await this.DMConversactionService.update(DMConversaction)
            if (!DMConversactionUpdatedResult.isSuccess()) return DMConversactionUpdatedResult.error

            const adminResponse = await createAdminEmbedResponse({
                methodName: casualTransaction.paymentMethodName,
                methodValue: casualTransaction.paymentMethodValue,
                guildName: guild.name,
                guildId: guild.id,
                memberId: memberId,
                paymentFrom: casualTransaction.paymentFrom,
                image: image
            })

            await interaction.editReply({
                embeds: [adminResponse.embed], 
                files: adminResponse.files, 
                components: [<any>adminResponse.buttonRow]
            })

            const userResponse = await userEmbedResponse()

            await DMConversactionUpdatableMessage.edit({
                embeds: [userResponse.embed], 
                files: userResponse.files
            })
    
        }
        catch (e) {
            logger.warn(e)
        }
    }
}