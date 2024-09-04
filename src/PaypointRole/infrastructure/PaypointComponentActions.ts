import { User } from "discord.js";
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
import { createUserPaymentClaimInterrogationEmbed } from "./Embeds/UserPaymentClaimInterrogationEmbed.js";
import { IMemberInput } from "../../Member/domain/IMemberInput.js";
import { IDMConversactionInput } from "../../DMConversaction/domain/IDMConversactionInput.js";
import { DMConversaction } from "../../DMConversaction/domain/DMConversaction.js";
import { createGuildPaymentAlreadyUnderReviewEmbed } from "./Embeds/GuildPaymentAlreadyUnderReviewEmbed.js";
import { logger } from "../../shared/utils/logger.js";
import { IComponentAction } from "../../shared/domain/IComponentAction.js";
import { IComponentActionData } from "../../shared/domain/IComponentActionData.js";

import { PaypointRoleComponentActionsEnum as Actions } from "../domain/PaypointRoleComponentActionsEnum.js"
import { MemberNotFoundError } from "../../Member/domain/MemberExceptions.js";
import { DMConversactionNotFoundError } from "../../DMConversaction/domain/DMConversactionExceptions.js";
import { CustomComponentID } from "../../shared/domain/CustomComponentID.js";
import { DMConversactionState } from "../../DMConversaction/domain/DMConversactionStateEnums.js";
import { createGuildMarkedPaymentPendingEmbed } from "./Embeds/GuildMarkedPaymentPendingEmbed.js";
import { createGuildPaymentInformationPendingEmbed } from "./Embeds/GuildPaymentInformationPendingEmbed.js";

export class PaypointComponentActions implements IComponentAction {
    id: string
    
    constructor (
        private service: IPaypointInput,
        private casualPaymentService: ICasualPaymentInput,
        private roleProductService: IRoleProductInput,
        private DMConversactionService: IDMConversactionInput,
        private memberService: IMemberInput
    ) {
        this.id = CustomComponentID.PAYPOINT_ROLE
    }

    async execute(interaction: ButtonInteraction | StringSelectMenuInteraction, data: IComponentActionData) {
        try {
            if (interaction.isStringSelectMenu()) {
                if (data.action == Actions.SELECT_PRODUCTS) {
                    return await this.createProductCart(interaction)
                }

                throw new UnknownStringSelectMenuInteractionError()
            }
            if (interaction.isButton()){
                if (data.action == Actions.CHOOSE_CASUAL_PAYMENT_METHOD){
                    return await this.createPaymentMethodDetailsCard(interaction, data)
                }

                if (data.action == Actions.CHOOSE_INTEGRATED_PAYMENT_METHOD){}

                if (data.action == Actions.MARK_PAYMENT_AS_SENT) {
                    return await this.createDMPaymentClaimInterrogation(interaction, data)
                }

                if (data.action == Actions.CONFIRM_MARKED_PAYMENT) {
                    return await this.confirmMarkedPayment(interaction, data)
                }

                if (data.action == Actions.DENY_MARKED_PAYMENT) {
                    return await this.denyMarkedPayment(interaction, data)
                }

                throw new UnknownButtonInteractionError()
            }

            throw new UnknownInteractionError()
        }
        catch (e) {
            return await EmbedResult.fail({description: InlineBlockText(String(e)), interaction})
        }
    }

    createProductCart = async (interaction: StringSelectMenuInteraction) => {
        try {
            await interaction.deferReply({ephemeral: true})

            const guildId = interaction.guildId
            if (!guildId) throw new GuildNotFoundError()
    
            const casualPaymentMethodsResult = await this.casualPaymentService.getAll(guildId)
            if (!casualPaymentMethodsResult.isSuccess()) return casualPaymentMethodsResult.error
    
            const casualPaymentMethods = casualPaymentMethodsResult.value
    
            const productId = interaction.values[0]
    
            const roleProductsResult = await this.roleProductService.get(productId)
            if (!roleProductsResult.isSuccess()) throw roleProductsResult.error
    
            const product = roleProductsResult.value
    
            const { productEmbed, paymentMethodEmbed, buttonRow, files} = await createGuildProductCartEmbed({casualPaymentMethods, product})
    
            return await interaction.editReply({embeds: [productEmbed, paymentMethodEmbed], files, components: [<any>buttonRow]})
        }
        catch (e) {
            return await EmbedResult.fail({description: InlineBlockText(String(e)), interaction})
        }

    }

    createPaymentMethodDetailsCard = async (interaction: ButtonInteraction, data: IComponentActionData) => {
        try {
            await interaction.deferReply({ephemeral: true})

            const guildId = interaction.guildId
            const member = interaction.member
    
            if (!member) throw new MemberNotFoundError()

            const DMConversactiveActiveResult = await this.DMConversactionService.getActiveOneByMember(member.user.id)
            
            if (DMConversactiveActiveResult.isSuccess()) {
                const DMConversaction = DMConversactiveActiveResult.value

                let response;
                
                if (DMConversaction.state == DMConversactionState.WAITING_USER_TO_CONFIRM_MARKED_PAYMENT){
                     response = await createGuildMarkedPaymentPendingEmbed()
                }
                else if (DMConversaction.state == DMConversactionState.WAITING_ADMIN_TO_APPROVE_PAYMENT){
                    response = await createGuildPaymentAlreadyUnderReviewEmbed()
                }
                else {
                    response = await createGuildPaymentInformationPendingEmbed()
                }
                return await interaction.editReply({content: "", embeds: [response.embed], files: response.files, components: []})

            }

            const DMConversactionAwaitingUserApprovalResult = await this.DMConversactionService.isAwaitingMemberApproval(member.user.id)
            if (!DMConversactionAwaitingUserApprovalResult.isSuccess()) throw DMConversactionAwaitingUserApprovalResult.error

            const isAwaitingUserApproval = DMConversactionAwaitingUserApprovalResult.value

            if (isAwaitingUserApproval) {
                const {embed, files} = await createGuildPaymentAlreadyUnderReviewEmbed()
                return await interaction.editReply({content: "", embeds: [embed], files, components: []})   
            }
    
            const DMConversactionPendingResult = await this.DMConversactionService.isAwaitingAdminApproval(member.user.id)
            if (!DMConversactionPendingResult.isSuccess()) throw DMConversactionPendingResult.error
    
            const isAwaitingAdminApproval = DMConversactionPendingResult.value
    
            if (isAwaitingAdminApproval) {
                const {embed, files} = await createGuildPaymentAlreadyUnderReviewEmbed()
                return await interaction.editReply({content: "", embeds: [embed], files, components: []})   
            }
    
            const rawMethodName = <string>data.values.rawMethodName
            const productId = <string>data.values.productId
    
            if (!guildId) throw new GuildNotFoundError()
            if (!member) throw new Error ("Member not found")
            if (!rawMethodName) throw new Error ("Raw method name not found")
    
            const result = await this.casualPaymentService.getByRawName(rawMethodName, guildId)
            if (!result.isSuccess()) throw result.error
    
            const casualPaymentMethod = result.value
    
            const {embed, files, buttonRow } = await createGuildPaymentMethodDetailsCardEmbed({
                memberUsername: member.user.username,
                memberAvatarURL: (member.user as User).avatarURL() ?? undefined,
                methodName: casualPaymentMethod.rawName,
                methodValue: casualPaymentMethod.value,
                productId: productId
            })
    
            return await interaction.editReply({embeds: [embed], files: files, components: [<any>buttonRow]})
        }
        catch (e) {
            logger.warn(e)
        }
    }

    createDMPaymentClaimInterrogation = async (interaction: ButtonInteraction, data: IComponentActionData) => {
        try {
            await interaction.deferUpdate()

            const guild = interaction.guild
            const guildMember = interaction.member
            const rawMethodName = <string>data.values.rawMethodName
            const productId = <string>data.values.productId
    
            if (!guild) throw new GuildNotFoundError()
            if (!guildMember) throw new MemberNotFoundError()
    
            const user = <User>guildMember.user
    
            const MemberResult = await this.memberService.get(guildMember.user.id, guild.id)
            if (!MemberResult.isSuccess()) throw MemberResult.error
    
            const member = MemberResult.value
    
            const casualPaymentMethodResult = await this.casualPaymentService.getByRawName(rawMethodName, guild.id)
            if (!casualPaymentMethodResult.isSuccess()) throw casualPaymentMethodResult.error
    
            const casualPaymentMethod = casualPaymentMethodResult.value

            const productResult = await this.roleProductService.get(productId)
            if (!productResult.isSuccess()) throw productResult.error
    
            const product = productResult.value
    
            const dmConversaction = new DMConversaction({
                member,
                memberId: member.id,
                guildId: guild.id,
                paymentMethodName: casualPaymentMethod.name,
                paymentMethodValue: casualPaymentMethod.value,
                product: product
            })
    
            const DMConversactionResult = await this.DMConversactionService.create(dmConversaction)
            if (!DMConversactionResult.isSuccess()) throw DMConversactionResult.error

            const DMConversactionCreated = DMConversactionResult.value

            const DMPaymentClaimResponse = await createUserPaymentClaimInterrogationEmbed({
                methodName: casualPaymentMethod.name.toUpperCase(),
                methodValue: casualPaymentMethod.value,
                guildName: guild.name,
                guildId: guild.id,
                DMConversactionId: DMConversactionCreated.id
            })
    
            await user.send({embeds: [DMPaymentClaimResponse.embed], files: DMPaymentClaimResponse.files, components: [<any>DMPaymentClaimResponse.buttonRow]})

            const CheckYourDMResponse = await createGuildCheckYourDMEmbed()
    
            await interaction.editReply({embeds: [CheckYourDMResponse.embed], files: CheckYourDMResponse.files, components: []})
        }
        catch (e) {
            return await EmbedResult.fail({description: InlineBlockText(String(e)), interaction})
        }
    }

    confirmMarkedPayment = async (interaction: ButtonInteraction, data: IComponentActionData) => {
        try {
            await interaction.deferUpdate()

            const client = interaction.client
            const user = <User>interaction.user

            const DMConversactionId = <string>data.values.DMConversactionId
            if (!DMConversactionId) throw new DMConversactionNotFoundError()

            await interaction.editReply({content: "...", embeds: [], components: [], files: []})
            
            client.emit("UserConfirmedMarkedCasualPayment", user, DMConversactionId)

        }
        catch (e) {
            return await EmbedResult.fail({description: InlineBlockText(String(e)), interaction})
        }
    }

    denyMarkedPayment = async (interaction: ButtonInteraction, data: IComponentActionData) => {
        try {
            await interaction.deferUpdate()

            const DMConversactionId = <string>data.values.DMConversactionId

            const DMConversactionResult = await this.DMConversactionService.get(DMConversactionId)
            if (!DMConversactionResult.isSuccess()) throw DMConversactionResult.error

            const DMConversaction = DMConversactionResult.value

            DMConversaction.state = DMConversactionState.CLOSED

            const DMConversactionUpdateResult = await this.DMConversactionService.update(DMConversaction)
            if (!DMConversactionUpdateResult.isSuccess()) throw DMConversactionUpdateResult.error

            //const {embed, files} = await createGuildMarkedPaymentDeniedEmbed()
            //await interaction.editReply({embeds: [embed], files: files, components: []})

            await interaction.message.delete()
        }
        catch (e) {
            return await EmbedResult.fail({description: InlineBlockText(String(e)), interaction})
        }
    }

}