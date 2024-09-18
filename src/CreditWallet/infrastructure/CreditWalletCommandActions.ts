import { ChatInputCommandInteraction, User } from "discord.js";
import { ICreditWalletInput } from "../domain/ICreditWalletInput.js";
import { MemberNotFoundError } from "../../Member/domain/MemberExceptions.js";
import { GuildNotFoundError } from "../../shared/domain/Exceptions.js";
import { EmbedResult } from "../../shared/intraestructure/EmbedResult.js";
import { logger } from "../../shared/utils/logger.js";
import { generateCreditBalanceCard } from "./ImageGenerator/CreditBalanceCard.js";
import { getBufferFromURL } from "../../shared/utils/AttachmentBuffer.js";

export class CreditWalletCommandActions {
    constructor (private service: ICreditWalletInput) {}

    execute = async (interaction: ChatInputCommandInteraction): Promise<void> => {
        try {
            await interaction.deferReply()

            const guild = interaction.guild
            if (!guild) throw new GuildNotFoundError()
            
            const member = interaction.member
            if (!member) throw new MemberNotFoundError()
            
            const user = <User>member.user

            const result = await this.service.get(user.id, guild.id)
            if (!result.isSuccess()) throw result.error

            const creditWallet = result.value

            const avatarImage = user.displayAvatarURL()
            ? await getBufferFromURL(user.displayAvatarURL())
            : null

            const attachment = await generateCreditBalanceCard({
                name: user.username,
                username: `@${user.username}`,
                avatarImage: avatarImage,
                credits: creditWallet.credits
            })

            await interaction.editReply({files: [attachment]})
            
        }catch(e){
            await EmbedResult.fail({description: String(e), interaction})
            logger.warn(String(e))
        }
    }
}