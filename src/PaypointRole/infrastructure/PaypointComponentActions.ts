import { User } from "discord.js";
import { ButtonInteraction, StringSelectMenuInteraction } from "discord.js";
import { IRoleProductInput } from "../../RoleProduct/domain/IRoleProductInput.js";
import { ICasualPaymentInput } from "../../CasualPayment/domain/ICasualPaymentInput.js";
import { IPaypointInput } from "../domain/IPaypointInput.js";
import { EmbedResult } from "../../shared/intraestructure/EmbedResult.js";
import { InlineBlockText } from "../../shared/utils/textFormating.js";
import { GuildNotFoundError } from "../../shared/domain/Exceptions.js";

import { createCard } from "./Embeds/PaymentMethodCardEmbed.js";
import { createProductCartEmbed } from "./Embeds/PaymentProductCartEmbed.js";
import { createPaymentDoneNotificationCardEmbed } from "./Embeds/PaymentDoneNotificationCardEmbed.js";
import { createDMNotificationCardEmbed } from "./Embeds/PaymentMarkedDMNotification.js";
import { ICasualTransactionInput } from "../../CasualTransaction/domain/ICasualTransactionInput.js";
import { CasualTransaction } from "../../CasualTransaction/domain/CasualTransaction.js";
import { cache } from "../../shared/intraestructure/Cache.js";
import { IMemberInput } from "../../Member/domain/IMemberInput.js";
import { IDMConversactionInput } from "../../DMConversaction/domain/IDMConversactionInput.js";
import { DMConversaction } from "../../DMConversaction/domain/DMConversaction.js";

export class PaypointComponentActions {
    customId: string
    
    constructor (
        private service: IPaypointInput,
        private casualPaymentService: ICasualPaymentInput,
        private roleProductService: IRoleProductInput,
        private DMConversactionService: IDMConversactionInput,
        private memberService: IMemberInput
    ) {
        this.customId = "PAYPOINT";
    }

    async execute(interaction: ButtonInteraction | StringSelectMenuInteraction) {
        try {
            const customId = interaction.customId

            if (customId == "PAYPOINT_SELECT_PRODUCTS" && interaction.isStringSelectMenu()) {
                return await this.createProductCart(interaction)
            }

            if (customId.startsWith("PAYPOINT_BUTTON_CASUALMETHOD") && interaction.isButton()) {
                return await this.createPaymentMethodCard(interaction)
            }

            if (customId.startsWith("PAYPOINT_BUTTON_MARK_PAYMENT") && interaction.isButton()) {
                return await this.createPaymentNotificationCard(interaction)
            }

            if (customId.startsWith("PAYPOINT_BUTTON_CONFIRM_MARK_PAYMENT")) {}
            if (customId.startsWith("PAYPOINT_BUTTON_DENY_MARK_PAYMENT")) {}
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
    
            const { productEmbed, paymentMethodEmbed, buttonRow, files} = await createProductCartEmbed({casualPaymentMethods, product})
    
            return await interaction.editReply({embeds: [productEmbed, paymentMethodEmbed], files, components: [<any>buttonRow]})
        }
        catch (e) {
            return await EmbedResult.fail({description: InlineBlockText(String(e)), interaction})
        }

    }

    createPaymentMethodCard = async (interaction: ButtonInteraction) => {
        await interaction.deferReply({ephemeral: true})

        const guildId = interaction.guildId
        const member = interaction.member
        const rawMethodName = interaction.customId.split("_").pop()?.toLowerCase()

        if (!guildId) throw new GuildNotFoundError()
        if (!member) throw new Error ("Member not found")
        if (!rawMethodName) throw new Error ("Raw method name not found")

        const result = await this.casualPaymentService.getByRawName(rawMethodName, guildId)
        if (!result.isSuccess()) throw result.error

        const casualPaymentMethod = result.value

        const {embed, files, buttonRow } = await createCard({
            memberUsername: member.user.username,
            memberAvatarURL: (member.user as User).avatarURL() ?? undefined,
            methodName: casualPaymentMethod.rawName,
            methodValue: casualPaymentMethod.value
        })

        return await interaction.editReply({embeds: [embed], files: files, components: [<any>buttonRow]})
    }

    createPaymentNotificationCard = async (interaction: ButtonInteraction) => {
        try {
            const guild = interaction.guild
            const guildMember = interaction.member
            const rawMethodName = interaction.customId.split("_").pop()?.toLowerCase()
    
            if (!guild) throw new GuildNotFoundError()
            if (!guildMember) throw new Error ("Member not found")
            if (!rawMethodName) throw new Error ("Raw method name not found")
    
            console.log(rawMethodName)
    
            const user = <User>guildMember.user
    
            const MemberResult = await this.memberService.get(guildMember.user.id, guild.id)
            if (!MemberResult.isSuccess()) throw MemberResult.error
    
            const member = MemberResult.value
    
            const result = await this.casualPaymentService.getByRawName(rawMethodName, guild.id)
            if (!result.isSuccess()) throw result.error
    
            const casualPaymentMethod = result.value
    
            let { embed, files } = await createPaymentDoneNotificationCardEmbed()
    
            await interaction.update({embeds: [embed], files, components: []})
    
            const dmConversaction = new DMConversaction({
                member,
                memberId: member.id,
                guildId: guild.id,
                paymentMethodName: casualPaymentMethod.name,
                paymentMethodValue: casualPaymentMethod.value,
                amount: 50
            })
    
            const DMConversactionResult = await this.DMConversactionService.create(dmConversaction)
            if (!DMConversactionResult.isSuccess()) throw DMConversactionResult.error
    
            let response = await createDMNotificationCardEmbed({
                methodName: casualPaymentMethod.name.toUpperCase(),
                methodValue: casualPaymentMethod.value,
                guildName: guild.name,
                guildId: guild.id
            })
    
            return await user.send({embeds: [response.embed], files: response.files, components: [<any>response.buttonRow]})
        }
        catch (e) {
            return await EmbedResult.fail({description: InlineBlockText(String(e)), interaction})
        }
    }

}