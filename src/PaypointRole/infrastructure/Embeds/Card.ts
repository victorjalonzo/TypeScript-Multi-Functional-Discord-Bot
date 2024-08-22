import { AttachmentBuilder, EmbedBuilder } from "discord.js"
import { Asset } from "../../../shared/intraestructure/Asset.js"
import { InlineBlockText } from "../../../shared/utils/textFormating.js"

interface IProps {
    memberUsername: string
    memberAvatarURL?: string
    methodName: string
    methodValue: string
}

export const createCard = async (props: IProps) => {
    const files: AttachmentBuilder[] = []

    const askedBy = `Asked by @${props.memberUsername}`
    const note = "After make the payment send me a screenshot\n to verify the payment."
    const title = `**${props.methodName.toUpperCase()}:**`

    const description = title + InlineBlockText(`${props.methodValue}`) + `\n${note}\n`

    const assetKey = props.methodName.split(" ").join("").toLowerCase()
    const thumbnail = await Asset.get(assetKey)

    files.push(thumbnail.attachment)

    const embed = new EmbedBuilder()
    //.setAuthor({ name: askedBy, iconURL: props.memberAvatarURL }) 
    //.setTitle(title)
    .setDescription(description)
    .setThumbnail(thumbnail.attachmentURL)
    .setFooter({ text: askedBy, iconURL: props.memberAvatarURL })
    .setColor(0x59cd3d)

    return { embed, files }

}