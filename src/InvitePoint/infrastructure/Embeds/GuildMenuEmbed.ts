import { AttachmentBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js"
import { ActionRowBuilder } from "discord.js"
import { Attachment } from "discord.js"
import { ComponentActionData } from "../../../shared/domain/ComponentActionData.js"
import { CustomComponentID } from "../../../shared/domain/CustomComponentID.js"
import { InvitePointComponentActionEnums as Actions } from "../../domain/InvitePointComponentActionEnums.js"

interface IProps {
    title?: string
    description?: string
    media?: AttachmentBuilder
}

export const createGuildMenuEmbed = async (props: IProps) => {
    const files: Attachment[] & AttachmentBuilder[] = []
    const embed = new EmbedBuilder()

    embed.setColor(0xd39d11)

    if (props.title) embed.setTitle(props.title)

    if (props.description) embed.setDescription(props.description)

    if (props.media) {
        embed.setImage(`attachment://${props.media.name}`)
        files.push(props.media)
    }

    const data = new ComponentActionData({
        id: CustomComponentID.INVITE_POINT,
        action: Actions.CREATE_LINK,
        values: {}
    })

    const button = new ButtonBuilder()
    .setStyle(ButtonStyle.Primary)
    .setCustomId(data.toString())
    .setLabel('CREATE INVITE LINK')

    const buttonRow = new ActionRowBuilder().addComponents(button)

    return {embed, buttonRow, files}
}
