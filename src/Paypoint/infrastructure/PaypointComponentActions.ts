import { ActionRow, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonComponent, ButtonStyle, ChannelType, Guild, GuildMember, Message, ModalBuilder, ModalSubmitInteraction, TextChannel, TextInputBuilder, TextInputStyle, ThreadAutoArchiveDuration, ThreadChannel, User } from "discord.js";
import { ButtonInteraction, StringSelectMenuInteraction } from "discord.js";
import { IRoleProductInput } from "../../RoleProduct/domain/IRoleProductInput.js";
import { ICasualPaymentInput } from "../../CasualPayment/domain/ICasualPaymentInput.js";
import { IPaypointInput } from "../domain/IPaypointInput.js";
import { EmbedResult } from "../../shared/intraestructure/EmbedResult.js";
import { InlineBlockText } from "../../shared/utils/textFormating.js";
import { GuildNotFoundError, UnknownButtonInteractionError, UnknownInteractionError, UnknownStringSelectMenuInteractionError } from "../../shared/domain/Exceptions.js";

import { createGuildPaymentMethodDetailsCardEmbed } from "./Embeds/GuildPaymentMethodDetailsCardEmbed.js";
import { createGuildProductCartEmbed } from "./Embeds/GuildProductCartEmbed.js";
import { createGuildCheckYourDMEmbed } from "./Embeds/GuildCheckYourDMEmbed.js";
import { IMemberInput } from "../../Member/domain/IMemberInput.js";
import { IThreadConversationInput } from "../../ThreadConversaction/domain/IThreadConversationInput.js";
import { ThreadConversation } from "../../ThreadConversaction/domain/ThreadConversation.js";
import { createGuildPaymentAlreadyUnderReviewEmbed } from "./Embeds/GuildPaymentAlreadyUnderReviewEmbed.js";
import { logger } from "../../shared/utils/logger.js";
import { IComponentAction } from "../../shared/domain/IComponentAction.js";
import { IComponentActionData } from "../../shared/domain/IComponentActionData.js";

import { PaypointComponentActionsEnum as Actions } from "../domain/PaypointComponentActionsEnum.js"
import { MemberNotFoundError } from "../../Member/domain/MemberExceptions.js";
import { ThreadConversationAlreadyWaitingApprovalError, ThreadConversationCancelledAlreadyError, ThreadConversationClosedAlreadyError, ThreadConversationNotFoundError, ThreadConversationUpdatableMessageNotFoundError } from "../../ThreadConversaction/domain/ThreadConversationExceptions.js";
import { CustomComponentID } from "../../shared/domain/CustomComponentID.js";
import { ThreadConversationState } from "../../ThreadConversaction/domain/ThreadConversationStateEnums.js";
import { createGuildMarkedPaymentPendingEmbed } from "./Embeds/GuildMarkedPaymentPendingEmbed.js";
import { createPaymentReceiptPendingEmbed } from "./Embeds/GuildPaymentReceiptPendingEmbed.js";
import { IRoleProduct } from "../../RoleProduct/domain/IRoleProduct.js";
import { ICreditProduct } from "../../CreditProduct/domain/ICreditProduct.js";
import { ICreditProductInput } from "../../CreditProduct/domain/ICreditProductInput.js";
import { getAttachmentFromBuffer } from "../../shared/utils/AttachmentBuffer.js";
import { createFormModal } from "./Modal/FormModal.js";
import { TextChannelNotFoundError } from "../../TextChannel/domain/TextChannelExceptions.js";
import { CreditProductNotFoundError } from "../../CreditProduct/domain/CreditProductExceptions.js";
import { RoleProductNotFound } from "../../RoleProduct/domain/RoleProductExceptions.js";
import { IGuildInput } from "../../Guild/domain/IGuildInput.js";
import { CasualTransactionNotFoundError } from "../../CasualTransaction/domain/CasualTransactionExceptions.js";
import { ICasualTransactionInput } from "../../CasualTransaction/domain/ICasualTransactionInput.js";
import { CasualTransactionState } from "../../CasualTransaction/domain/CasualTransactionStateEnums.js";
import { createAdminSuccessPaymentEmbed } from "./Embeds/AdminSuccessPaymentEmbed.js";
import { createUserPaymentSucessEmbed } from "./Embeds/UserPaymentSucessEmbed.js";
import { ProductType } from "../../shared/domain/ProductTypeEnums.js";
import { ICreditWalletInput } from "../../CreditWallet/domain/ICreditWalletInput.js";
import { RoleNotFoundError } from "../../Role/domain/RoleException.js";
import { createAdminFailedPaymentEmbed } from "./Embeds/AdminFailedPaymentEmbed.js";
import { createUserPaymentFailedEmbed } from "./Embeds/UserPaymentFailedEmbed.js";
import { createAdminFakePaymentEmbed } from "./Embeds/AdminFakePaymentEmbed.js";
import { createUserPaymentFakeEmbed } from "./Embeds/UserPaymentFakeEmbed.js";
import { CasualPaymentNotFoundError } from "../../CasualPayment/domain/CasualPaymentExceptions.js";
import { ICasualTransaction } from "../../CasualTransaction/domain/ICasualTransaction.js";
import { IRole } from "../../Role/domain/IRole.js";
import { ICreditWallet } from "../../CreditWallet/domain/ICreditWallet.js";
import { ProductTypeNotSupported } from "../domain/PaypointExceptions.js";
import { createGoToThreadEmbed } from "./Embeds/GoToThreadEmbed.js";
import { createPaymentReceiptRequiredEmbed } from "./Embeds/PaymentReceiptRequiredEmbed.js";
import { IThreadConversation } from "../../ThreadConversaction/domain/IThreadConversation.js";
import { ICasualPayment } from "../../CasualPayment/domain/ICasualPayment.js";

export class PaypointComponentActions implements IComponentAction {
    id: string
    
    constructor (
        private service: IPaypointInput,
        private guildService: IGuildInput,
        private casualPaymentService: ICasualPaymentInput,
        private roleProductService: IRoleProductInput,
        private creditProductService: ICreditProductInput,
        private threadConversationService: IThreadConversationInput,
        private memberService: IMemberInput,
        private casualTransactionService: ICasualTransactionInput,
        private creditWalletService: ICreditWalletInput
    ) {
        this.id = CustomComponentID.PAYPOINT_ROLE
    }

    async execute(interaction: ButtonInteraction | StringSelectMenuInteraction, data: IComponentActionData) {
        try {
            if (interaction.isStringSelectMenu()) {
                if (data.action == Actions.SELECT_PRODUCTS) {
                    return await this.displayProductCart(interaction)
                }

                throw new UnknownStringSelectMenuInteractionError()
            }

            if (interaction.isModalSubmit()) {
                if (data.action == Actions.PAYMENT_REQUEST_FORM_SUBMITED) {
                    return await this.receiveModalForm(interaction, data)
                }
            }

            if (interaction.isButton()){
                if (data.action == Actions.CHOOSE_CASUAL_PAYMENT_METHOD){
                    return await this.createPaymentMethodDetailsCard(interaction, data)
                }

                if (data.action == Actions.CHOOSE_INTEGRATED_PAYMENT_METHOD){}

                if (data.action == Actions.MARK_PAYMENT_AS_SENT) {
                    return await this.openModalForm(interaction, data)
                }

                if (data.action == Actions.PAYMENT_REQUEST_CANCELLED) {
                    return await this.cancelPaymentRequest(interaction, data)
                }

                if (data.action == Actions.MARK_INCOMING_PAYMENT_AS_SUCCESS) {
                    return await this.markPayment(interaction, data, "SUCCESS")
                }
                if (data.action == Actions.MARK_INCOMING_PAYMENT_AS_FAKE) {
                    return await this.markPayment(interaction, data, "FAKE")
                }
                if (data.action == Actions.MARK_INCOMING_PAYMENT_AS_FAILED) {
                    return await this.markPayment(interaction, data, "FAILED")
                }

                throw new UnknownButtonInteractionError()
            }

            throw new UnknownInteractionError()
        }
        catch (e) {
            return await EmbedResult.fail({description: InlineBlockText(String(e)), interaction})
        }
    }

    markPayment = async (
        interaction: ButtonInteraction, 
        data: IComponentActionData, 
        markAs: "SUCCESS" | "FAILED" | "FAKE"
    ) => {
        try {
            await interaction.deferUpdate();

            const threadConversationId = <string>data.values.threadConversationId

            const threadConversation = await this.threadConversationService.get(threadConversationId)
            .then(result => result.isSuccess() ? result.value : Promise.reject(result.error))

            if (!threadConversation.casualTransactionId) throw new CasualTransactionNotFoundError()

            const casualTransaction = await this.casualTransactionService.get(threadConversation.casualTransactionId)
            .then(result => result.isSuccess() ? result.value : Promise.reject(result.error))

            if (!casualTransaction.isPending()) {
                throw new Error(`This transaction was marked as ${casualTransaction.state} already.`)
            }

            const guild = interaction.client.guilds.cache.get(threadConversation.guildId)
            if (!guild) throw new GuildNotFoundError()

            const member = await guild.members.fetch(threadConversation.memberId)
            if (!member) throw new MemberNotFoundError()

            if (!threadConversation.updatableMessageId) throw new ThreadConversationUpdatableMessageNotFoundError()

            if (!threadConversation.threadChannelId) throw new Error("Thread channel record id not found")
            
            const threadChannel = await guild.channels.fetch(threadConversation.threadChannelId)
            if (!threadChannel) throw new Error("Thread channel not found")
            if (!threadChannel.isThread()) throw new Error("Channel is not a thread")

            const threadUpdatableMessage = await threadChannel.messages.fetch(threadConversation.updatableMessageId)
                
            const image = await getAttachmentFromBuffer(casualTransaction.invoices[0])

            if (markAs == "SUCCESS") {
                await this._markAsSuccess(guild, member, casualTransaction, image, interaction, threadUpdatableMessage)
            }
            else if (markAs == "FAILED") {
                await this._markAsFailed(guild, member, casualTransaction, image, interaction, threadUpdatableMessage)
            }
            else {
                await this._markAsFake(guild, member, casualTransaction, image, interaction, threadUpdatableMessage)
            }

            await this.casualTransactionService.update(casualTransaction)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

            threadConversation.state = ThreadConversationState.CLOSED

            await this.threadConversationService.update(threadConversation)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))
    
        }
        catch (e) {
            logger.warn(e)
        }
    }

    _markAsSuccess = async (
        guild: Guild,
        member: GuildMember,
        casualTransaction: ICasualTransaction,
        image: AttachmentBuilder,
        interaction: ButtonInteraction,
        threadUpdatableMessage: Message
    ) => {
        const guildRecord = await this.guildService.get(guild.id)
        .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

        let product: ICreditProduct | IRoleProduct

        if (casualTransaction.productType == ProductType.CREDIT) {
            product = <ICreditProduct>await this.creditProductService.get(casualTransaction.productId)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

            const totalCredit = await this.creditWalletService.increment(casualTransaction.memberId, casualTransaction.guildId, product.credits)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

            logger.info(`The member ${member.user.username} (${member.user.id}) bought ${product.credits} credits for $${product.price} USD, their total credits is now ${totalCredit} credits.`)
            
            if (guildRecord.defaultInvoiceChannel) {
                const channel = <TextChannel>await guild.channels.fetch(guildRecord.defaultInvoiceChannel.id)
                if (channel) await channel.send({content: `<@${member.user.id}> bought ${product.credits} credits, now their balance is ${totalCredit} credits.`})
            }

        }
        else {
            product = <IRoleProduct> await this.roleProductService.get(casualTransaction.productId)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

            const role = await guild.roles.fetch(casualTransaction.productId)
            if (!role) throw new RoleNotFoundError()

            await member.roles.add(role)

            logger.info(`The member ${member.user.username} (${member.user.id}) bought the role ${role.name} (${role.id})`)

            if (guildRecord.defaultInvoiceChannel) {
                const channel = <TextChannel>await guild.channels.fetch(guildRecord.defaultInvoiceChannel.id)
                if (channel) await channel.send({content: `<@${member.user.id}> bought the role <@&${role.id}>`})
            }
        }

        casualTransaction.state = CasualTransactionState.SUCCESS

        const adminEmbedResponse = await createAdminSuccessPaymentEmbed({
            methodName: casualTransaction.casualPaymentMethodName,
            methodValue: casualTransaction.casualPaymentMethodValue,
            guildName: guild.name,
            guildId: guild.id,
            memberId: casualTransaction.memberId,
            paymentFrom: casualTransaction.paymentFrom,
            image: image
        })

        await interaction.editReply({
            embeds: [adminEmbedResponse.embed], 
            files: adminEmbedResponse.files, 
            components: [<any>adminEmbedResponse.buttonRow]
        })

        if (threadUpdatableMessage) {
            const userEmbedResponse = await createUserPaymentSucessEmbed({product})

            await threadUpdatableMessage.edit({
                embeds: [userEmbedResponse.embed], 
                files: userEmbedResponse.files
            })
        }
    }

    _markAsFailed = async (
        guild: Guild,
        member: GuildMember,
        casualTransaction: ICasualTransaction,
        image: AttachmentBuilder,
        interaction: ButtonInteraction,
        threadUpdatableMessage: Message
    ) => {
        casualTransaction.state = CasualTransactionState.FAILED

        const adminEmbedResponse = await createAdminFailedPaymentEmbed({
            methodName: casualTransaction.casualPaymentMethodName,
            methodValue: casualTransaction.casualPaymentMethodValue,
            guildName: guild.name,
            guildId: guild.id,
            memberId: casualTransaction.memberId,
            paymentFrom: casualTransaction.paymentFrom,
            image: image
        })

        await interaction.editReply({
            embeds: [adminEmbedResponse.embed], 
            files: adminEmbedResponse.files, 
            components: [<any>adminEmbedResponse.buttonRow]
        })

        if (threadUpdatableMessage) {
            const userEmbedResponse = await createUserPaymentFailedEmbed()

            await threadUpdatableMessage.edit({
                embeds: [userEmbedResponse.embed], 
                files: userEmbedResponse.files
            })
        }

        logger.info(`Payment of the member ${member.user.username} (${member.user.id}) was marked as failed`)
    }

    _markAsFake = async (
        guild: Guild,
        member: GuildMember,
        casualTransaction: ICasualTransaction,
        image: AttachmentBuilder,
        interaction: ButtonInteraction,
        threadUpdatableMessage: Message
    ) => {
        casualTransaction.state = CasualTransactionState.FAKE

        const adminEmbedResponse = await createAdminFakePaymentEmbed({
            methodName: casualTransaction.casualPaymentMethodName,
            methodValue: casualTransaction.casualPaymentMethodValue,
            guildName: guild.name,
            guildId: guild.id,
            memberId: casualTransaction.memberId,
            paymentFrom: casualTransaction.paymentFrom,
            image: image
        })

        await interaction.editReply({
            embeds: [adminEmbedResponse.embed], 
            files: adminEmbedResponse.files, 
            components: [<any>adminEmbedResponse.buttonRow]
        })

        if (threadUpdatableMessage) {
            const userEmbedResponse = await createUserPaymentFakeEmbed()

            await threadUpdatableMessage.edit({
                embeds: [userEmbedResponse.embed], 
                files: userEmbedResponse.files
            })
        }

        logger.info(`Payment of the member ${member.user.username} (${member.user.id}) was marked as fake`)
    }

    displayProductCart = async (interaction: StringSelectMenuInteraction) => {
        try {
            await interaction.deferReply({ephemeral: true})

            const guildId = interaction.guildId
            if (!guildId) throw new GuildNotFoundError()
    
            const casualPaymentMethodsResult = await this.casualPaymentService.getAll(guildId)
            if (!casualPaymentMethodsResult.isSuccess()) return casualPaymentMethodsResult.error
    
            const casualPaymentMethods = casualPaymentMethodsResult.value
    
            const productId = interaction.values[0]

            const paypointResult = await this.service.get(guildId)
            if (!paypointResult.isSuccess()) throw paypointResult.error

            const paypoint = paypointResult.value

            let product: IRoleProduct | ICreditProduct

            let productName: string
            let productPrice: number
            let productDescription: string | undefined | null
            let productMedia: AttachmentBuilder | undefined

            if (paypoint.isBasedOnCreditProduct()) {
                const creditProductsResult = await this.creditProductService.get(productId)
                if (!creditProductsResult.isSuccess()) throw creditProductsResult.error

                product = creditProductsResult.value
                productName = product.name
            }
            else if (paypoint.isBasedOnRoleProduct()) {
                const roleProductsResult = await this.roleProductService.get(productId)
                if (!roleProductsResult.isSuccess()) throw roleProductsResult.error

                product = roleProductsResult.value
                productName = product.role.name
            }
            
            else throw new ProductTypeNotSupported()
            
            productPrice = product.price
            productDescription = product.description

            if (product.media) {
                productMedia = await getAttachmentFromBuffer(product.media)
            }

            const response = await createGuildProductCartEmbed({
                casualPaymentMethods: casualPaymentMethods,
                productId: productId,
                productName: productName,
                productPrice:productPrice,
                productDescription:productDescription,
                productMedia:productMedia
            })
    
            return await interaction.editReply({
                embeds: [response.productEmbed, response.paymentMethodEmbed], 
                files: response.files, 
                components: [...<any>response.buttonRows]})
        }
        catch (e) {
            return await EmbedResult.fail({description: InlineBlockText(String(e)), interaction})
        }
    }

    createPaymentMethodDetailsCard = async (interaction: ButtonInteraction, data: IComponentActionData) => {
        try {
            await interaction.deferReply({ephemeral: true})

            const guild = interaction.guild
            const member = interaction.member
    
            if (!member) throw new MemberNotFoundError()

            const casualPaymentMethodId = <string>data.values.methodId
            const productId = <string>data.values.productId
    
            if (!guild) throw new GuildNotFoundError()
            if (!member) throw new MemberNotFoundError()
            if (!casualPaymentMethodId) throw new CasualPaymentNotFoundError()
    
            const casualPaymentMethod = await this.casualPaymentService.get(casualPaymentMethodId, guild.id)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))
                
            const threadConversation = await this.threadConversationService.getActiveOneByMember(member.user.id, guild.id)
            .then(r => r.isSuccess() ? r.value : null)
            
            if (threadConversation) {
                const threadChannel = <ThreadChannel>await guild.channels.fetch(threadConversation.threadChannelId)
                .catch(() => null)
                
                if (!threadChannel) {
                    await this.threadConversationService.delete(threadConversation.id)
                    .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))
                }
                else {
                    return await this._createPaymentPendingWarning(threadConversation, threadChannel, interaction)
                }
            }
    
            const {embed, files, buttonRow } = await createGuildPaymentMethodDetailsCardEmbed({
                memberUsername: member.user.username,
                memberAvatarURL: (member.user as User).avatarURL() ?? undefined,
                methodName: casualPaymentMethod.rawName,
                methodValue: casualPaymentMethod.value,
                productId: productId,
                methodId: casualPaymentMethodId
            })
    
            return await interaction.editReply({
                embeds: [embed], 
                files: files, 
                components: [<any>buttonRow]
            })
        }
        catch (e) {
            logger.warn(e)
        }
    }

    _createPaymentPendingWarning = async (
        threadConversation: IThreadConversation,
        threadChannel: ThreadChannel,
        interaction: ButtonInteraction, 
    ) => {
        let response;
                
        if (threadConversation.isWaitingAdminApproval()){
            response = await createGuildPaymentAlreadyUnderReviewEmbed()
        }
        else if (threadConversation.isWaitingUserPaymentReceipt()){
            response = await createPaymentReceiptPendingEmbed({
                threadConversation: threadConversation,
                threadChannel: threadChannel
            })
        }
        else throw new Error('Unexpected thread conversation state')

        return await interaction.editReply({
            content: "", 
            embeds: [response.embed], 
            files: response.files, 
            components: (response as any).buttonRow ? [<any>(response as any).buttonRow] : []
        })
    }

    receiveModalForm = async (interaction: ModalSubmitInteraction, data: IComponentActionData) => {
        await interaction.deferUpdate()
        
        const identifier = interaction.fields.getTextInputValue('identifier');
        const channel = interaction.channel
        const member = interaction.member
        const guildId = interaction.guildId

        if (!guildId) throw new GuildNotFoundError()
        if (!channel) throw new TextChannelNotFoundError()
        if (channel.type != ChannelType.GuildText) throw new Error('Channel is not a text channel')
        if (!member) throw new MemberNotFoundError()

        const casualPaymentMethodId = <string>data.values.casualPaymentMethodId
        const productId = <string>data.values.productId

        const paypoint = await this.service.get(guildId)
        .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

        const guildRecord = await this.guildService.get(guildId)
        .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

        const memberRecord = await this.memberService.get(member.user.id, guildId)
        .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

        const casualPaymentMethod = await this.casualPaymentService.get(casualPaymentMethodId, guildId)
        .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

        let product: ICreditProduct | IRoleProduct

        if (paypoint.isBasedOnCreditProduct()) {
            product = await this.creditProductService.get(productId)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))
        }
        else if (paypoint.isBasedOnRoleProduct()) {
            product = await this.roleProductService.get(productId)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))
        }
        else throw new ProductTypeNotSupported()
    
        const thread = await channel.threads.create({
            name: `${member.user.username} payment request verification`,
            autoArchiveDuration: ThreadAutoArchiveDuration.ThreeDays,
            type: ChannelType.PrivateThread
        })

        const threadConversation = new ThreadConversation({
            member: memberRecord,
            guild: guildRecord,
            casualPaymentMethod: casualPaymentMethod,
            product: product,
            paymentFrom: identifier,
            threadChannelId: thread.id
        })

        const threadConversationCreated = await this.threadConversationService.create(threadConversation)
        .then(r => r.isSuccess() ? r.value : Promise.reject(r.error)) 

        const paymentInvoiceRequiredEmbed = await createPaymentReceiptRequiredEmbed({
            casualPaymentMethod: casualPaymentMethod,
            threadConversation: threadConversationCreated
        })

        await thread.send({
            content: `<@${member.user.id}>`,
            embeds: [paymentInvoiceRequiredEmbed.embed],
            files: paymentInvoiceRequiredEmbed.files,
            components: [<any>paymentInvoiceRequiredEmbed.buttonRow]
        })

        const goToThreadEmbed = await createGoToThreadEmbed({
            threadChannel: thread,
            casualPaymentMethod: casualPaymentMethod
        })

        await interaction.editReply({
            embeds: [goToThreadEmbed.embed],
            files: goToThreadEmbed.files,
            components: []
        })
    }

    openModalForm = async (interaction: ButtonInteraction, data: IComponentActionData) => {
        try {
            const casualPaymetMethodId = <string>data.values.methodId
            const productId = <string>data.values.productId

            if (!interaction.guildId) throw new GuildNotFoundError()

            const casualPaymentMethod = await this.casualPaymentService.get(casualPaymetMethodId, interaction.guildId)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

            const modal = createFormModal({
                casualPaymentMethod: casualPaymentMethod,
                productId: productId
            })

            await interaction.showModal(modal);
        }
        catch (e) {
            await EmbedResult.fail({interaction, description: String(e)})
            logger.warn(e)
        }
    }

    async cancelPaymentRequest(interaction: ButtonInteraction, data: IComponentActionData) {
        try {
            await interaction.deferUpdate()

            if (!interaction.guild) throw new GuildNotFoundError()

            const threadConversationId = <string>data.values.threadConversationId

            const threadConversation = await this.threadConversationService.cancel(threadConversationId)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

            const threadChannelId = threadConversation.threadChannelId
            const threadChannel = await interaction.guild.channels.fetch(threadChannelId)

            if (!threadChannel) throw new Error("Thread channel was not found")
            await threadChannel.delete()

            if (!interaction.channel) return
            if (interaction.channel.type !== ChannelType.GuildText) return

            const title = "Payment request canceled"
            const description = "Your pending payment request has been canceled. You can submit a new payment request at any time."

            await EmbedResult.success({interaction, title, description})
        }
        catch(e) {
            if (e instanceof ThreadConversationClosedAlreadyError || e instanceof ThreadConversationCancelledAlreadyError || e instanceof ThreadConversationAlreadyWaitingApprovalError) {
                await this._disablePaymentRequestButton(interaction)
            }
            else {
                logger.error(e)
            }
        }
    }

    async _disablePaymentRequestButton (interaction: ButtonInteraction) {
        try {
            const currentButtonRow = <ActionRowBuilder><unknown> interaction.message.components[0];
            const currentButton = <ButtonComponent><unknown>currentButtonRow.components[0]
    
            const button = new ButtonBuilder()
            .setLabel(<string>currentButton.label)
            .setCustomId(<string>currentButton.customId)
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true)
    
            const buttonRow = new ActionRowBuilder().addComponents(button)
    
            await interaction.editReply({components: [<any>buttonRow]})
        }
        catch (e) {
            logger.error(e)
        }
    }

}