import { AttachmentBuilder, EmbedBuilder } from "discord.js"
import { Asset } from "../../../shared/intraestructure/Asset.js"

export const createPaymentAlreadyUnderReviewEmbed = async (): Promise<{embed: EmbedBuilder, files: AttachmentBuilder[]}> => {
    const files: AttachmentBuilder[] = []

    const icon = await Asset.get('warning')
    files.push(icon.attachment)

    const description = "Check your DM and confirm or deny your payment marked as sent before making another one."

    const embed = new EmbedBuilder()
    .setAuthor({ name: description, iconURL: icon.attachmentURL})
    .setColor(0xcf971a)
    
    return {embed, files}
}