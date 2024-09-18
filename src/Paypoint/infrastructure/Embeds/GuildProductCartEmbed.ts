import { ActionRowBuilder, Attachment, AttachmentBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js"
import { ICasualPayment } from "../../../CasualPayment/domain/ICasualPayment.js"
import { Asset } from "../../../shared/intraestructure/Asset.js"
import { BoldText, ItalicText, SimpleBlockText } from "../../../shared/utils/textFormating.js"
import { PaypointComponentActionsEnum as Actions } from "../../domain/PaypointComponentActionsEnum.js"
import { CustomComponentID } from "../../../shared/domain/CustomComponentID.js"
import { ComponentActionData } from "../../../shared/domain/ComponentActionData.js"

type TOptions = {
    casualPaymentMethods: ICasualPayment[]
    productId: string
    productName: string,
    productPrice: number
    productDescription?: string | null
    productMedia?: AttachmentBuilder
}

export const createGuildProductCartEmbed = async (options: TOptions): Promise<{productEmbed: EmbedBuilder, paymentMethodEmbed: EmbedBuilder, buttonRow: ActionRowBuilder, files: AttachmentBuilder[]}> => {
    const files: AttachmentBuilder[] = []

    const productName = `**Product Name**:${SimpleBlockText(options.productName)}`
    const productPrice = `**Product Price**: ${SimpleBlockText(options.productPrice.toString() + " USD")}`
    
    const productDescription = BoldText("Product Description:\n") + ItalicText(options.productDescription 
        ? options.productDescription
        : "No description provided."
    )
    
    const description = `${productName}\n${productPrice}\n\n${productDescription}\n\n`
    const productThumbnail = await Asset.get('cart')

    const productEmbed = new EmbedBuilder()
    .setDescription(description)
    .setThumbnail(productThumbnail.attachmentURL)

    files.push(productThumbnail.attachment)

    if (options.productMedia) {
        productEmbed.setImage("attachment://" + options.productMedia.name)
        files.push(options.productMedia)
    }
    else {
        const media = await Asset.get('product-default')
        productEmbed.setImage("attachment://" + media.attachment.name)
        files.push(media.attachment)
    }

    const paymentMethodDescription = BoldText("Choose Your Payment Method Below 💳")
    const paymentMethodEmbed = new EmbedBuilder()
    .setDescription(paymentMethodDescription)

    const buttons: ButtonBuilder[] = []

    for (const paymentMethod of options.casualPaymentMethods) {
        const data = new ComponentActionData({
            id: CustomComponentID.PAYPOINT_ROLE,
            action: Actions.CHOOSE_CASUAL_PAYMENT_METHOD,
            values: {
                rawMethodName: paymentMethod.rawName,
                productId: options.productId
            }
        })

        buttons.push(new ButtonBuilder()
            .setCustomId(data.toString())
            .setLabel(paymentMethod.name)
            .setStyle(ButtonStyle.Primary)
        )
    }

    const buttonRow = new ActionRowBuilder().addComponents(...buttons)

    return {productEmbed, paymentMethodEmbed, buttonRow, files}
}