import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js"
import { Asset } from "../../../shared/intraestructure/Asset.js"
import { SimpleBlockText } from "../../../shared/utils/textFormating.js"

interface IProps {
    methodName: string
    methodValue: string
    guildName: string
    guildId: string
    DMConversactionId: string
}

export const createDMNotificationCardEmbed = async (props: IProps) => {
    const files: AttachmentBuilder[] = []

    const description = `You claimed you made a payment in the server ${SimpleBlockText(props.guildName)} through ${SimpleBlockText(props.methodName)} to the account ${SimpleBlockText(props.methodValue)}. ¿That is true?`

    const icon = await Asset.get("security")

    files.push(icon.attachment)

    const embed = new EmbedBuilder()
    .setDescription(description)
    .setColor(0xf7a911)
    .setAuthor({ name: `Verification`, iconURL: icon.attachmentURL })

    const confirmButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Success)
    .setCustomId(`PAYPOINT_BUTTON_CONFIRM_MARK_PAYMENT_${props.DMConversactionId}`)
    .setLabel("Yes")

    const denyButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Danger)
    .setCustomId(`PAYPOINT_BUTTON_DENY_MARK_PAYMENT_${props.DMConversactionId}`)
    .setLabel("No")

    const buttonRow = new ActionRowBuilder().addComponents(confirmButton, denyButton)

    return { embed, files, buttonRow }

}