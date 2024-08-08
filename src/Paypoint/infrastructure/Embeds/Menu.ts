import { AttachmentBuilder, EmbedBuilder } from "discord.js"
import { StringSelectMenuBuilder } from "discord.js"
import { StringSelectMenuOptionBuilder } from "discord.js"
import { ButtonBuilder } from "discord.js"
import { ActionRowBuilder } from "discord.js"
import { ButtonStyle } from "discord.js"
import { Attachment } from "discord.js"
import { ICredit } from "../../../Credit/domain/ICredit.js"
import { ICasualPayment } from "../../../CasualPayment/domain/ICasualPayment.js"
import { Asset } from "../../../shared/intraestructure/Asset.js"

interface IProps {
    title?: string
    description?: string
    image?: Attachment
    credits: ICredit[]
    casualPaymentMethods: ICasualPayment[]
}

export const createGUI = async (props: IProps) => {
    const files: Attachment[] & AttachmentBuilder[] = []
    const embed = new EmbedBuilder()

    embed.setColor(0xd39d11)

    const icon = await Asset.get('verified')
    files.push(icon.attachment)

    embed.setAuthor({name: 'Secure Payments', iconURL: icon.attachmentURL})

    if (props.title) embed.setTitle(props.title)

    if (props.description) embed.setDescription(props.description)

    if (props.image) embed.setImage(props.image.url)

    const options: StringSelectMenuOptionBuilder[]= []

    for (const credit of props.credits) {
        options.push(
            new StringSelectMenuOptionBuilder()
            .setLabel(`${credit.amount} credits for ${credit.price}$`)
            .setValue(credit.price.toString())
        )
    }

    const selectRow = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
        .setCustomId('paypoint_selectMethods')
        .setPlaceholder('Select the credit amount')
        .addOptions(...options)
    )

    const buttons: ButtonBuilder[] = []

    for (const paymentMethod of props.casualPaymentMethods) {
        const rawPaymentMethodName = paymentMethod.name.split(" ").join("").toLowerCase()
        const customId = `paypoint_${rawPaymentMethodName}`

        buttons.push(new ButtonBuilder()
            .setCustomId(customId)
            .setLabel(paymentMethod.name)
            .setStyle(ButtonStyle.Primary)
        )
    }

    const buttonRow = new ActionRowBuilder().addComponents(...buttons)

    return {embed, selectRow, buttonRow, files}
}
