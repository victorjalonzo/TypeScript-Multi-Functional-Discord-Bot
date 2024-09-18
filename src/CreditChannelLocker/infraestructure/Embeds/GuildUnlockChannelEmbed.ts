import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js"
import { Asset } from "../../../shared/intraestructure/Asset.js"
import { BoldText, InlineBlockText, SimpleBlockText } from "../../../shared/utils/textFormating.js"
import { ComponentActionData } from "../../../shared/domain/ComponentActionData.js"
import { CustomComponentID } from "../../../shared/domain/CustomComponentID.js"
import { CreditChannelLockerComponentActionsEnums as Actions } from "../../domain/CreditChannelLockerActionsEnums.js"

interface IProps {
    sourceChannelId: string
    lockerChannelId: string
    price: number
    description?: string | null
    media?: AttachmentBuilder | null,
    mediaCodec?: string | null
}

export const createGuildUnlockChannelEmbed = async (props: IProps) => {
    const files: AttachmentBuilder[] = []

    const embed = new EmbedBuilder()
    .setColor(0x75239e)

    const channelSection = `${BoldText('CHANNEL')}: <#${props.sourceChannelId}>`
    const creditSection = `${BoldText('UNLOCK WITH')}: ${props.price} CREDITS`

    const descriptionSection = props.description
    ? `${BoldText('DESCRIPTION')}:\n${props.description}`
    : ""

    const description = `${channelSection}\n${creditSection}\n\n${descriptionSection}`

    embed.setDescription(description)

    if (props.media) {
        embed.setImage(`attachment://${props.media.name}`)
        files.push(props.media)
    }
    else {
        const folder = await Asset.get("folder")
        embed.setImage(folder.attachmentURL)
        files.push(folder.attachment)
    }

    const data = new ComponentActionData({
        id: CustomComponentID.CREDIT_CHANNEL_LOCKER,
        action: Actions.UNLOCK,
        values: {
            lockerChannelId: props.lockerChannelId
        }
    })

    const button = new ButtonBuilder()
    .setStyle(ButtonStyle.Success)
    .setCustomId(data.toString())
    .setLabel("UNLOCK THIS CHANNEL")

    const buttonRow = new ActionRowBuilder().addComponents(button)

    return { embed, files, buttonRow }

}