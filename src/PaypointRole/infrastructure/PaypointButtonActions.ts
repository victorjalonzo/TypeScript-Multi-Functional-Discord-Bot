import { ICreditInput } from "../../Credit/domain/ICreditInput.js";
import { ICasualPaymentInput } from "../../CasualPayment/domain/ICasualPaymentInput.js";
import { IPaypointInput } from "../domain/IPaypointInput.js";
import { ButtonInteraction } from "discord.js";
import { createCard } from "./Embeds/Card.js";
import { EmbedResult } from "../../shared/intraestructure/EmbedResult.js";
import { InlineBlockText } from "../../shared/utils/textFormating.js";
import { User } from "discord.js";

export class PaypointButtonActions {
    customId: string
    
    constructor (
        private service: IPaypointInput,
        private casualPaymentService: ICasualPaymentInput
    ) {
        this.customId = "paypoint";
    }

    async execute(interaction: ButtonInteraction) {
        try {
            const customId = interaction.customId
            const guildId = interaction.guildId
            const member = interaction.member
            const rawMethodName = customId.split("_")[1]
    
            if (!guildId || !member || !rawMethodName) return
    
            const result = await this.casualPaymentService.getByRawName(rawMethodName, guildId)
    
            if (!result.isSuccess()) throw new Error("This payment method is not available")

            const casualPaymentMethod = result.value

            const {embed, files } = await createCard({
                memberUsername: member.user.username,
                memberAvatarURL: (member.user as User).avatarURL() ?? undefined,
                methodName: casualPaymentMethod.name,
                methodValue: casualPaymentMethod.value
            })

            return await interaction.reply({embeds: [embed], files: files, ephemeral: true})
        }
        catch (e) {
            return await EmbedResult.fail({description: InlineBlockText(String(e)), interaction})
        }
    }

}