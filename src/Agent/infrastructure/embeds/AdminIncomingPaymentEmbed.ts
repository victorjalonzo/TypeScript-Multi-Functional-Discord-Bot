import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js"
import { Asset } from "../../../shared/intraestructure/Asset.js"
import { AgentComponentActionsEnums as Actions } from "../../domain/AgentComponentActionsEnums.js"
import { CustomComponentID } from "../../../shared/domain/CustomComponentID.js"
import { ComponentActionData } from "../../../shared/domain/ComponentActionData.js"
import { SimpleBlockText } from "../../../shared/utils/textFormating.js"

interface IProps {
    methodName: string
    methodValue: string
    guildName: string
    guildId: string
    memberId: string
    paymentFrom: string
    image: AttachmentBuilder,
    DMConversactionId: string
}

export const createAdminIncomingPaymentEmbed = async (props: IProps) => {
    const files: AttachmentBuilder[] = []

    const markSuccessData = new ComponentActionData({
        id: CustomComponentID.AGENT,
        action: Actions.MARK_INCOMING_PAYMENT_AS_SUCCESS,
        values: {DMConversactionId: props.DMConversactionId}
    })
    const markFailedData = new ComponentActionData({
        id: CustomComponentID.AGENT,
        action: Actions.MARK_INCOMING_PAYMENT_AS_FAILED,
        values: {DMConversactionId: props.DMConversactionId}
    })
    const markFakeData = new ComponentActionData({
        id: CustomComponentID.AGENT,
        action: Actions.MARK_INCOMING_PAYMENT_AS_FAKE,
        values: {DMConversactionId: props.DMConversactionId}
    })

    const description = `
A user just claimed to made a payment today at ${props.guildName}(${props.guildId}). Please realize one of the actions below.

**GUILD** : ${props.guildName} (${props.guildId})
**MEMBER** : <@${props.memberId}>

**PAYMENT DETAILS**:

**METHOD USED** : ${SimpleBlockText(props.methodName)}
**METHOD VALUE** : ${SimpleBlockText(props.methodValue)}
**PAYMENT FROM** : ${SimpleBlockText(props.paymentFrom)}
    `

    const icon = await Asset.get("income")

    files.push(icon.attachment)
    files.push(props.image)

    const embed = new EmbedBuilder()
    .setDescription(description)
    .setColor(0x2bceff)
    .setAuthor({ name: `INCOMING PAYMENT`, iconURL: icon.attachmentURL })
    .setImage(`attachment://${props.image.name}`)

    const confirmButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Success)
    .setCustomId(markSuccessData.toString())
    .setLabel("Success")

    const failButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Danger)
    .setCustomId(markFailedData.toString())
    .setLabel("Failed")

    const fakeButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Secondary)
    .setCustomId(markFakeData.toString())
    .setLabel("Fake")

    const buttonRow = new ActionRowBuilder().addComponents(confirmButton, failButton, fakeButton)

    return { embed, files, buttonRow }

}