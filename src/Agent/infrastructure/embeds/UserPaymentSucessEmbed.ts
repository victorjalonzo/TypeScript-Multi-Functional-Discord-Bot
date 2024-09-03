import { AttachmentBuilder, EmbedBuilder } from "discord.js"
import { Asset } from "../../../shared/intraestructure/Asset.js"

export const createUserPaymentSucessEmbed = async () => {
    const files: AttachmentBuilder[] = []

    const icon = await Asset.get("success")
    files.push(icon.attachment)

    const embed = new EmbedBuilder()
    .setAuthor({ name:`PAYMENT SUCCESSFUL`, iconURL: icon.attachmentURL })
    .setTitle("Your payment has been confirmed!")
    .setDescription("You will now receive your role automatically. Thank you for your patience and support.")
    .setColor(0x17dd3d)

    return { embed, files }
}