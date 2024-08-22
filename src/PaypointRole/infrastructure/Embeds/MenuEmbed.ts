import { AttachmentBuilder, EmbedBuilder } from "discord.js"
import { StringSelectMenuBuilder } from "discord.js"
import { StringSelectMenuOptionBuilder } from "discord.js"
import { ButtonBuilder } from "discord.js"
import { ActionRowBuilder } from "discord.js"
import { ButtonStyle } from "discord.js"
import { Attachment } from "discord.js"
import { ICasualPayment } from "../../../CasualPayment/domain/ICasualPayment.js"
import { Asset } from "../../../shared/intraestructure/Asset.js"
import { IRoleProduct } from "../../../RoleProduct/domain/IRoleProduct.js"

interface IProps {
    title?: string
    description?: string
    media?: AttachmentBuilder
    products: IRoleProduct[],
    casualPaymentMethods: ICasualPayment[]
}

export const Menu = async (props: IProps) => {
    const files: Attachment[] & AttachmentBuilder[] = []
    const embed = new EmbedBuilder()

    embed.setColor(0xd39d11)

    const icon = await Asset.get('verified')

    files.push(icon.attachment)

    embed.setAuthor({name: 'Payment gateway', iconURL: icon.attachmentURL})

    if (props.title) embed.setTitle(props.title)

    if (props.description) embed.setDescription(props.description)

    if (props.media) {
        embed.setImage(`attachment://${props.media.name}`)
        files.push(props.media)
    }

    const options: StringSelectMenuOptionBuilder[]= []

    for (const [_, product] of props.products.entries()) {
        options.push(
            new StringSelectMenuOptionBuilder()
            .setLabel(`${product.role.name} (${product.price}$ USD)`)
            .setValue(product.role.id)
        )
    }

    const selectRow = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
        .setCustomId('paypoint_select_roleproducts')
        .setPlaceholder('Select the product')
        .addOptions(...options)
    )

    return {embed, selectRow, files}
}
