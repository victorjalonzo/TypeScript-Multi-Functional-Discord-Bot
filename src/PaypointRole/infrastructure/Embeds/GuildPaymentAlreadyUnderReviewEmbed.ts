import { AttachmentBuilder, EmbedBuilder } from "discord.js"
import { Asset } from "../../../shared/intraestructure/Asset.js"

export const createGuildPaymentAlreadyUnderReviewEmbed = async (): Promise<{embed: EmbedBuilder, files: AttachmentBuilder[]}> => {
    const files: AttachmentBuilder[] = []

    const icon = await Asset.get('warning')
    files.push(icon.attachment)

    const description = "You already have a payment under review. Please wait until the current payment is approved before making another one."

    const embed = new EmbedBuilder()
    .setAuthor({ name: description, iconURL: icon.attachmentURL})
    .setColor(0xcf971a)
    
    return {embed, files}
}