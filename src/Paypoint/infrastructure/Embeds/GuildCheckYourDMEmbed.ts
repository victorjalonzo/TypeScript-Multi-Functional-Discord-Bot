import { AttachmentBuilder, EmbedBuilder } from "discord.js"
import { Asset } from "../../../shared/intraestructure/Asset.js"
import { InlineBlockText } from "../../../shared/utils/textFormating.js"

export const createGuildCheckYourDMEmbed = async (): Promise<{embed: EmbedBuilder, files: AttachmentBuilder[]}> => {
    const files: AttachmentBuilder[] = []

    const icon = await Asset.get('mail')
    
    files.push(icon.attachment)

    const embed = new EmbedBuilder()
    .setThumbnail(icon.attachmentURL)
    .setDescription(`${InlineBlockText('I Sent You a Message,\nCheck Your DM Please.')}`)
    .setColor(0xe6e8ee)
    
    return {embed, files}
}