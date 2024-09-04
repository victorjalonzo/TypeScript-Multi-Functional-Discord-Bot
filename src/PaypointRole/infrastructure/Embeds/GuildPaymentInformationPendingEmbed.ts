import { AttachmentBuilder, EmbedBuilder } from "discord.js"
import { Asset } from "../../../shared/intraestructure/Asset.js"

export const createGuildPaymentInformationPendingEmbed = async (): Promise<{embed: EmbedBuilder, files: AttachmentBuilder[]}> => {
    const files: AttachmentBuilder[] = []

    const icon = await Asset.get('warning')
    files.push(icon.attachment)

    const description = "You still have information to provide for the payment you marked as sent. Please check your DM and provide the required details before attempting to mark another payment as sent."

    const embed = new EmbedBuilder()
    .setAuthor({ name: description, iconURL: icon.attachmentURL})
    .setColor(0xcf971a)
    
    return {embed, files}
}