import { AttachmentBuilder, EmbedBuilder } from "discord.js"
import { Asset } from "../../../shared/intraestructure/Asset.js"
import { IRoleProduct } from "../../../RoleProduct/domain/IRoleProduct.js"
import { ICreditProduct } from "../../../CreditProduct/domain/ICreditProduct.js"
import { ProductType } from "../../../shared/domain/ProductTypeEnums.js"

interface IOptions {
    product: ICreditProduct | IRoleProduct
}

export const createUserPaymentSucessEmbed = async (options: IOptions) => {
    const files: AttachmentBuilder[] = []

    const icon = await Asset.get("success")
    files.push(icon.attachment)

    let title: string 
    let description = "Your payment was successfully processed."
    let thumbnail: Record<string, any>;

    if (options.product.type === ProductType.CREDIT) {
        title = "Credits Added Successfully"
        description += `\nYou have received **${(options.product as ICreditProduct).credits}** credits.`
        + "\n\nUse the command **/credits** to check your balance."

        thumbnail = await Asset.get("coins")
        files.push(thumbnail.attachment)
    }
    else {
        title = "Role Assigned Successfully!"
        description += `\nYou have received **${(options.product as IRoleProduct).role.name}** role.`
        + "\n\nUse the new permissions and features of your role to enhance your experience."

        thumbnail = await Asset.get("crown")
        files.push(thumbnail.attachment)
    }

    description += "\n\n**Thank you for your patience and support.**"

    const embed = new EmbedBuilder()
    .setAuthor({ name:`Success`, iconURL: icon.attachmentURL })
    .setTitle(title)
    .setDescription(description)
    .setThumbnail(thumbnail.attachmentURL)
    .setColor(0x17dd3d)

    return { embed, files }
}