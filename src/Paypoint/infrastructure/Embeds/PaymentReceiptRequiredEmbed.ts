import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, GuildMember, ThreadChannel } from "discord.js"
import { Asset } from "../../../shared/intraestructure/Asset.js"
import { ICasualPayment } from "../../../CasualPayment/domain/ICasualPayment.js"
import { CasualPaymentMethodType } from "../../../CasualPayment/domain/CasualPaymentMethodType.js"
import { TitleCase } from "../../../shared/utils/TitleCase.js"
import { ComponentActionData } from "../../../shared/domain/ComponentActionData.js"
import { CustomComponentID } from "../../../shared/domain/CustomComponentID.js"
import { PaypointComponentActionsEnum as Actions } from "../../domain/PaypointComponentActionsEnum.js"
import { IThreadConversation } from "../../../ThreadConversaction/domain/IThreadConversation.js"

interface IOptions {
    casualPaymentMethod: ICasualPayment,
    threadConversation: IThreadConversation
}

export const createPaymentReceiptRequiredEmbed = async (options: IOptions) => {
    const files: AttachmentBuilder[] = []

    const thumbnail = await Asset.get("phone-receipt")
    files.push(thumbnail.attachment)

    const data = new ComponentActionData({
        id: CustomComponentID.PAYPOINT_ROLE,
        action: Actions.PAYMENT_REQUEST_CANCELLED,
        values: {
            threadConversationId: options.threadConversation.id
        }
    })

    const methodName = TitleCase(options.casualPaymentMethod.name)

    const description = `**Please upload a screenshot of your ${methodName} payment receipt to verify your payment.**`

    const icon = await Asset.get("security")
    files.push(icon.attachment)

    const button = new ButtonBuilder()
        .setCustomId(data.toString())
        .setLabel("CANCEL PAYMENT REQUEST")
        .setStyle(ButtonStyle.Danger)
    
    const buttonRow = new ActionRowBuilder().addComponents(button);

    const embed = new EmbedBuilder()
    .setDescription(description)
    .setColor(0xf7a911)
    .setAuthor({ name: `Security verification`, iconURL: icon.attachmentURL })
    .setThumbnail(thumbnail.attachmentURL)

    return { embed, buttonRow, files }
}