import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js"
import { Asset } from "../../../shared/intraestructure/Asset.js"
import { SimpleBlockText } from "../../../shared/utils/textFormating.js"
import { ComponentActionData } from "../../../shared/domain/ComponentActionData.js"
import { CustomComponentID } from "../../../shared/domain/CustomComponentID.js"

import { PaypointRoleComponentActionsEnum as Actions } from "../../domain/PaypointRoleComponentActionsEnum.js"

interface IProps {
    methodName: string
    methodValue: string
    guildName: string
    guildId: string
    DMConversactionId: string
}

export const createUserPaymentClaimInterrogationEmbed = async (props: IProps) => {
    const files: AttachmentBuilder[] = []

    const description = `You claimed you made a payment in the server ${SimpleBlockText(props.guildName)} through ${SimpleBlockText(props.methodName)} to the account ${SimpleBlockText(props.methodValue)}. ¿That is true?`

    const icon = await Asset.get("security")

    files.push(icon.attachment)

    const embed = new EmbedBuilder()
    .setDescription(description)
    .setColor(0xf7a911)
    .setAuthor({ name: `Verification`, iconURL: icon.attachmentURL })

    const confirmMarkedPaymentData = new ComponentActionData({
        id: CustomComponentID.PAYPOINT_ROLE,
        action: Actions.CONFIRM_MARKED_PAYMENT,
        values: {
            DMConversactionId: props.DMConversactionId
        }
    })

    const denyMarkedPaymentData = new ComponentActionData({
        id: CustomComponentID.PAYPOINT_ROLE,
        action: Actions.DENY_MARKED_PAYMENT,
        values: {
            DMConversactionId: props.DMConversactionId
        }
    })

    const confirmButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Success)
    .setCustomId(confirmMarkedPaymentData.toString())
    .setLabel("Yes")

    const denyButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Danger)
    .setCustomId(denyMarkedPaymentData.toString())
    .setLabel("No")

    const buttonRow = new ActionRowBuilder().addComponents(confirmButton, denyButton)

    return { embed, files, buttonRow }

}