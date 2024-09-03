import { AttachmentBuilder, EmbedBuilder } from "discord.js"
import { Asset } from "../../../shared/intraestructure/Asset.js"

interface IProps {
    title: string
    description: string
    count: string
}

export const createUserVerificationQuestionEmbed = async (props: IProps) => {
    const files: AttachmentBuilder[] = []

    const icon = await Asset.get("security")

    files.push(icon.attachment)

    const embed = new EmbedBuilder()
    .setTitle(props.title)
    .setDescription(props.description)
    .setColor(0xf7a911)
    .setAuthor({ name: `Verification ${props.count}`, iconURL: icon.attachmentURL })


    return { embed, files }

}