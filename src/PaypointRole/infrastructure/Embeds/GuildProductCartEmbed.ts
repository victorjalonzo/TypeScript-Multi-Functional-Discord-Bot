import { ActionRowBuilder, Attachment, AttachmentBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js"
import { ICasualPayment } from "../../../CasualPayment/domain/ICasualPayment.js"
import { IRoleProduct } from "../../../RoleProduct/domain/IRoleProduct.js"
import { Asset } from "../../../shared/intraestructure/Asset.js"
import { BoldText, ItalicText, SimpleBlockText } from "../../../shared/utils/textFormating.js"
import { PaypointRoleComponentActionsEnum as Actions } from "../../domain/PaypointRoleComponentActionsEnum.js"
import { CustomComponentID } from "../../../shared/domain/CustomComponentID.js"
import { ComponentActionData } from "../../../shared/domain/ComponentActionData.js"

type TOptions = {
    casualPaymentMethods: ICasualPayment[]
    product: IRoleProduct
}

export const createGuildProductCartEmbed = async (options: TOptions): Promise<{productEmbed: EmbedBuilder, paymentMethodEmbed: EmbedBuilder, buttonRow: ActionRowBuilder, files: AttachmentBuilder[]}> => {
    const { product } = options
    const files: AttachmentBuilder[] = []

    const productId = product.role.id
    const productName = `**Product Name**:${SimpleBlockText(product.role.name)}`
    const productPrice = `**Product Price**: ${SimpleBlockText(product.price.toString() + " USD")}`
    const productDescription = product.description ? `**Product Description**:\n${ItalicText(product.description)}` : "-"
    const productInfo = `${productName}\n${productPrice}\n\n${productDescription}\n\n`
    const productThumbnail = await Asset.get('cart')

    const productEmbed = new EmbedBuilder()
    .setDescription(productInfo)
    .setThumbnail(productThumbnail.attachmentURL)

    files.push(productThumbnail.attachment)

    if (product.media && product.mediaFilename) {
        const productMedia = new AttachmentBuilder(product.media, { name: product.mediaFilename })
        productEmbed.setImage("attachment://" + productMedia.name)
        files.push(productMedia)
    }

    const paymentMethodDescription = BoldText("Choose Your Payment Method Below 💳")
    const paymentMethodEmbed = new EmbedBuilder()
    .setDescription(paymentMethodDescription)

    const buttons: ButtonBuilder[] = []

    for (const paymentMethod of options.casualPaymentMethods) {
        const rawMethodName = paymentMethod.name.split(" ").join("").toLowerCase()

        const data = new ComponentActionData({
            id: CustomComponentID.PAYPOINT_ROLE,
            action: Actions.CHOOSE_CASUAL_PAYMENT_METHOD,
            values: {
                rawMethodName: rawMethodName,
                productId: productId
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