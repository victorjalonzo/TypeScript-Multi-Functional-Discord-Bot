import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js"
import { Asset } from "../../../shared/intraestructure/Asset.js"
import { SimpleBlockText } from "../../../shared/utils/textFormating.js"

interface IProps {
    methodName: string
    methodValue: string
    guildName: string
    guildId: string
}

export const createDirectNotificationCardEmbed = async (props: IProps) => {
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
    .setCustomId(`paypoint_button_payment_confirm_${props.methodName}`)
    .setLabel("Yes")

    const denyButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Danger)
    .setCustomId(`paypoint_button_payment_deny_${props.methodName}`)
    .setLabel("No")

    const buttonRow = new ActionRowBuilder().addComponents(confirmButton, denyButton)

    return { embed, files, buttonRow }

}