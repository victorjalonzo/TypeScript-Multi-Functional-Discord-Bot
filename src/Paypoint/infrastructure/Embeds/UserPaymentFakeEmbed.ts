import { AttachmentBuilder, EmbedBuilder } from "discord.js"
import { Asset } from "../../../shared/intraestructure/Asset.js"

export const createUserPaymentFakeEmbed = async () => {
    const files: AttachmentBuilder[] = []

    const icon = await Asset.get("warning")
    files.push(icon.attachment)

    const embed = new EmbedBuilder()
    .setAuthor({ name:`FAKE PAYMENT DETECTED`, iconURL: icon.attachmentURL })
    .setTitle("Your payment appears to be fraudulent.")
    .setDescription("Our system has detected that the payment you provided is not valid. Please ensure you use a legitimate payment method. If this is an error, contact support immediately to resolve the issue. Further attempts to provide fake payments could result in account banned from the server.")
    .setColor(0xe8a82d)

    return { embed, files }
}