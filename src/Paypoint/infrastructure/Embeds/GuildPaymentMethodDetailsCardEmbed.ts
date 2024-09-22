import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js"
import { Asset } from "../../../shared/intraestructure/Asset.js"
import { InlineBlockText } from "../../../shared/utils/textFormating.js"
import { ComponentActionData } from "../../../shared/domain/ComponentActionData.js"
import { CustomComponentID } from "../../../shared/domain/CustomComponentID.js"
import { PaypointComponentActionsEnum as Actions } from "../../domain/PaypointComponentActionsEnum.js"

interface IProps {
    memberUsername: string
    memberAvatarURL?: string
    methodName: string
    methodValue: string
    productId: string
    methodId: string
}

export const createGuildPaymentMethodDetailsCardEmbed = async (props: IProps) => {
    const files: AttachmentBuilder[] = []

    const note = "**After make the payment, press the button below\nto mark the payment as sent.**"
    const title = `**${props.methodName.toUpperCase()}:**`

    const description = title + InlineBlockText(`${props.methodValue}`) + `\n${note}\n`

    const assetKey = props.methodName.split(" ").join("").toLowerCase()
    const thumbnail = await Asset.get(assetKey)

    files.push(thumbnail.attachment)

    const embed = new EmbedBuilder()
    .setDescription(description)
    .setThumbnail(thumbnail.attachmentURL)
    .setColor(0x59cd3d)

    const data = new ComponentActionData({
        id: CustomComponentID.PAYPOINT_ROLE,
        action: Actions.MARK_PAYMENT_AS_SENT,
        values: {
            methodId: props.methodId,
            productId: props.productId

        }
    })

    const button = new ButtonBuilder()
    .setStyle(ButtonStyle.Success)
    .setCustomId(data.toString())
    .setLabel("MARK PAYMENT AS SENT ✅")

    const buttonRow = new ActionRowBuilder().addComponents(button)

    return { embed, files, buttonRow }

}