import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ThreadChannel } from "discord.js"
import { Asset } from "../../../shared/intraestructure/Asset.js"
import { ICasualPayment } from "../../../CasualPayment/domain/ICasualPayment.js"
import { TitleCase } from "../../../shared/utils/TitleCase.js"
import { ComponentActionData } from "../../../shared/domain/ComponentActionData.js"
import { CustomComponentID } from "../../../shared/domain/CustomComponentID.js"
import { PaypointComponentActionsEnum as Actions } from "../../domain/PaypointComponentActionsEnum.js"
import { IThreadConversation } from "../../../ThreadConversaction/domain/IThreadConversation.js"

interface IOptions {
    threadConversation: IThreadConversation
    threadChannel: ThreadChannel
}

export const createPaymentReceiptPendingEmbed = async (
    options: IOptions
): Promise<{
    embed: EmbedBuilder, 
    files: AttachmentBuilder[],
    buttonRow: ActionRowBuilder
}> => {
    const files: AttachmentBuilder[] = []

    const icon = await Asset.get('warning')
    files.push(icon.attachment)

    const data = new ComponentActionData({
        id: CustomComponentID.PAYPOINT_ROLE,
        action: Actions.PAYMENT_REQUEST_CANCELLED,
        values: {
            threadConversationId: options.threadConversation.id
        }
    })

    const methodName = TitleCase(options.threadConversation.casualPaymentMethodName)

    const title = `Please complete the pending information for the ${methodName} payment before submitting another payment or canceling the pending request.`

    const description = `Channel: <#${options.threadChannel.id}>`

    const button = new ButtonBuilder()
        .setCustomId(data.toString())
        .setLabel("CANCEL PENDING PAYMENT REQUEST")
        .setStyle(ButtonStyle.Danger)
    
    const buttonRow = new ActionRowBuilder().addComponents(button);

    const embed = new EmbedBuilder()
    .setAuthor({ name: title, iconURL: icon.attachmentURL})
    .setDescription(description)
    .setColor(0xcf971a)
    
    return {embed, files, buttonRow}
}