import { User } from "discord.js";
import { ButtonInteraction, StringSelectMenuInteraction } from "discord.js";
import { ICreditInput } from "../../Credit/domain/ICreditInput.js";
import { IRoleProductInput } from "../../RoleProduct/domain/IRoleProductInput.js";
import { ICasualPaymentInput } from "../../CasualPayment/domain/ICasualPaymentInput.js";
import { IPaypointInput } from "../domain/IPaypointInput.js";
import { EmbedResult } from "../../shared/intraestructure/EmbedResult.js";
import { InlineBlockText } from "../../shared/utils/textFormating.js";
import { GuildNotFoundError } from "../../shared/domain/Exceptions.js";

import { createCard } from "./Embeds/PaymentMethodCardEmbed.js";
import { createProductCartEmbed } from "./Embeds/PaymentProductCartEmbed.js";
import { createPaymentDoneNotificationCardEmbed } from "./Embeds/PaymentDoneNotificationCardEmbed.js";
import { createDirectNotificationCardEmbed } from "./Embeds/PaymentConfirmationDirectNotification.js";

export class PaypointComponentActions {
    customId: string
    
    constructor (
        private service: IPaypointInput,
        private casualPaymentService: ICasualPaymentInput,
        private roleProductService: IRoleProductInput
    ) {
        this.customId = "paypoint";
    }

    async execute(interaction: ButtonInteraction | StringSelectMenuInteraction) {
        try {
            const customId = interaction.customId

            if (customId == "paypoint_select_roleproducts" && interaction.isStringSelectMenu()) {
                return await this.createProductCart(interaction)
            }

            if (customId.startsWith("paypoint_button_casualpayment") && interaction.isButton()) {
                return await this.createPaymentMethodCard(interaction)
            }

            if (customId.startsWith("paypoint_button_payment_done") && interaction.isButton()) {
                return await this.createPaymentNotificationCard(interaction)
            }
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
        const rawMethodName = interaction.customId.split("_").pop()

        if (!guildId) throw new GuildNotFoundError()
        if (!member) throw new Error ("Member not found")
        if (!rawMethodName) throw new Error ("Raw method name not found")

        const result = await this.casualPaymentService.getByRawName(rawMethodName, guildId)
        if (!result.isSuccess()) throw result.error

        const casualPaymentMethod = result.value

        const {embed, files, buttonRow } = await createCard({
            memberUsername: member.user.username,
            memberAvatarURL: (member.user as User).avatarURL() ?? undefined,
            methodName: casualPaymentMethod.name,
            methodValue: casualPaymentMethod.value
        })

        return await interaction.editReply({embeds: [embed], files: files, components: [<any>buttonRow]})
    }

    createPaymentNotificationCard = async (interaction: ButtonInteraction) => {
        const guildId = interaction.guildId
        const member = interaction.member

        if (!guildId) throw new GuildNotFoundError()
        if (!member) throw new Error ("Member not found")

        const { embed, files } = await createPaymentDoneNotificationCardEmbed()

        return await interaction.update({embeds: [embed], files, components: []})
    }

    createDirectNotificationCard = async (interaction: ButtonInteraction) => {
        const guildId = interaction.guildId
        const member = interaction.member

        if (!guildId) throw new GuildNotFoundError()
        if (!member) throw new Error ("Member not found")

        const user = <User>member.user

        const { embed, files } = await createDirectNotificationCardEmbed({
            guildName: guildId,
            guildId: guildId,
            methodName: "Cash App",
            methodValue: "Jhon$"
        })

        return await user.send({embeds: [embed], files})
    }

}