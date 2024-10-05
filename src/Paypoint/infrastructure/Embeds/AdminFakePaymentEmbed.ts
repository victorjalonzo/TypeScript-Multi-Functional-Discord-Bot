import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js"
import { Asset } from "../../../shared/intraestructure/Asset.js"
import { SimpleBlockText } from "../../../shared/utils/textFormating.js"

interface IProps {
    methodName: string
    methodValue: string
    guildName: string
    guildId: string
    memberId: string
    paymentFrom: string
    image: AttachmentBuilder,
}

export const createAdminFakePaymentEmbed = async (props: IProps) => {
    const files: AttachmentBuilder[] = []

    const description = `
**GUILD** : ${props.guildName} (${props.guildId})
**MEMBER** : <@${props.memberId}>

**PAYMENT DETAILS**:

**METHOD USED** : ${SimpleBlockText(props.methodName)}
**METHOD VALUE** : ${SimpleBlockText(props.methodValue)}
**PAYMENT FROM** : ${SimpleBlockText(props.paymentFrom)}
    `

    const icon = await Asset.get("warning")

    files.push(icon.attachment)
    files.push(props.image)

    const embed = new EmbedBuilder()
    .setDescription(description)
    .setColor(0xf7a911)
    .setAuthor({ name: `FAKE PAYMENT`, iconURL: icon.attachmentURL })
    .setImage(`attachment://${props.image.name}`)

    const confirmButton = new ButtonBuilder()
    .setCustomId('disabled_confirm')
    .setStyle(ButtonStyle.Secondary)
    .setLabel("Success")
    .setDisabled(true)

    const failButton = new ButtonBuilder()
    .setCustomId('disabled_fail')
    .setStyle(ButtonStyle.Secondary)
    .setLabel("Failed")
    .setDisabled(true)

    const fakeButton = new ButtonBuilder()
    .setCustomId('disabled_fake')
    .setStyle(ButtonStyle.Secondary)
    .setLabel("Fake")
    .setDisabled(true)

    const buttonRow = new ActionRowBuilder().addComponents(confirmButton, failButton, fakeButton)

    return { embed, files, buttonRow }
}