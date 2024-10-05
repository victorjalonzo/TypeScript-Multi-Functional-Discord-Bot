import { AttachmentBuilder, EmbedBuilder } from "discord.js"
import { Asset } from "../../../shared/intraestructure/Asset.js"

export const createUserPaymentFailedEmbed = async () => {
    const files: AttachmentBuilder[] = []

    const icon = await Asset.get("failed")
    files.push(icon.attachment)

    const embed = new EmbedBuilder()
    .setAuthor({ name:`PAYMENT FAILED`, iconURL: icon.attachmentURL })
    .setTitle("There was an issue with your payment.")
    .setDescription("Unfortunately, we couldn't confirm your payment. Please check your payment details and try again. If the problem persists, contact support for further assistance.")
    .setColor(0xe51010)

    return { embed, files }
}