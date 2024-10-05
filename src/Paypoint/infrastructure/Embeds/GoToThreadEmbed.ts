import { AttachmentBuilder, EmbedBuilder, ThreadChannel } from "discord.js"
import { Asset } from "../../../shared/intraestructure/Asset.js"
import { ICasualPayment } from "../../../CasualPayment/domain/ICasualPayment.js"
import { TitleCase } from "../../../shared/utils/TitleCase.js"

interface IProps {
    threadChannel: ThreadChannel
    casualPaymentMethod: ICasualPayment
}

export const createGoToThreadEmbed = async (props: IProps) => {
    const files: AttachmentBuilder[] = []

    const methodName = TitleCase(props.casualPaymentMethod.name)

    const description = `**Please head to the channel below and upload a screenshot of your ${methodName} payment receipt to begin the verification process.**\n\n**Channel**: <#${props.threadChannel.id}>`

    const icon = await Asset.get("security")
    files.push(icon.attachment)

    const embed = new EmbedBuilder()
    .setDescription(description)
    .setColor(0xf7a911)
    .setAuthor({ name: `Security verification`, iconURL: icon.attachmentURL })

    return { embed, files }
}