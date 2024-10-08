import { AttachmentBuilder, EmbedBuilder } from "discord.js"
import { StringSelectMenuBuilder } from "discord.js"
import { StringSelectMenuOptionBuilder } from "discord.js"
import { ActionRowBuilder } from "discord.js"
import { Attachment } from "discord.js"
import { ICasualPayment } from "../../../CasualPayment/domain/ICasualPayment.js"
import { Asset } from "../../../shared/intraestructure/Asset.js"
import { IRoleProduct } from "../../../RoleProduct/domain/IRoleProduct.js"
import { ComponentActionData } from "../../../shared/domain/ComponentActionData.js"
import { PaypointComponentActionsEnum as Actions } from "../../domain/PaypointComponentActionsEnum.js"
import { CustomComponentID } from "../../../shared/domain/CustomComponentID.js"
import { CreditProduct } from "../../../CreditProduct/domain/CreditProduct.js"

interface IProps {
    title?: string
    description?: string
    media?: AttachmentBuilder
    products: CreditProduct[] | IRoleProduct[],
}

export const createGuildMenuEmbed = async (props: IProps) => {
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

    props.products.forEach(product => {
        options.push(
            new StringSelectMenuOptionBuilder()
            .setLabel(`${product.name} ($${product.price} USD)`)
            .setValue(product.id)
            .setEmoji('🪙')
        )
    })

    const data = new ComponentActionData({
        id: CustomComponentID.PAYPOINT_ROLE,
        action: Actions.SELECT_PRODUCTS,
        values: {}
    })

    const selectRow = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
        .setCustomId(data.toString())
        .setPlaceholder('Select product')
        .addOptions(...options)
    )

    return {embed, selectRow, files}
}
