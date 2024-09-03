import { AttachmentBuilder, EmbedBuilder } from "discord.js"
import { Asset } from "../../../shared/intraestructure/Asset.js"

export const createUserPaymentUnderReviewEmbed = async () => {
    const files: AttachmentBuilder[] = []

    const icon = await Asset.get("timerun.gif")
    files.push(icon.attachment)

    const embed = new EmbedBuilder()
    .setTitle("Please wait a few minutes while we evaluate your payment.")
    .setDescription("You will receive a notification once the payment is confirmed, and your role will be assigned automatically if everything is in order.")
    .setColor(0xf7a911)
    .setAuthor({ name: `PAYMENT UNDER REVIEW`, iconURL: icon.attachmentURL })

    return { embed, files }
}