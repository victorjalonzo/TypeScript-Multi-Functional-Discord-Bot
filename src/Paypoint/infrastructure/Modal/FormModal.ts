import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { ComponentActionData } from "../../../shared/domain/ComponentActionData.js";
import { CustomComponentID } from "../../../shared/domain/CustomComponentID.js";
import { PaypointComponentActionsEnum as Actions } from "../../domain/PaypointComponentActionsEnum.js";
import { ICasualPayment } from "../../../CasualPayment/domain/ICasualPayment.js";

interface IOptions {
    casualPaymentMethod: ICasualPayment
    productId: string
}

export const createFormModal = (options: IOptions): ModalBuilder => {
    const data = new ComponentActionData({
        id: CustomComponentID.PAYPOINT_ROLE,
        action: Actions.PAYMENT_REQUEST_FORM_SUBMITED,
        values: {
            casualPaymentMethodId: options.casualPaymentMethod.id,
            productId: options.productId
        }
    })

    const identifierQuestions: Record<string, any>= {
        cashapp: {
            label: "What is your Cash App $tagname?",
            placeholder: "$tagname"
        },
        applepay: {
            label: "What is your Apple Pay email address/number?",
            placeholder: "type email address or phone number"
        },
        paypal: {
            label: "What is your PayPal email address?",
            placeholder: "email address"
        },
        zelle: {
            label: "What is your Zelle email address/number?",
            placeholder: "type email address or phone number"
        },
        venmo: {
            label: "What is your Venmo username?",
            placeholder: "@username"
        },
        googlepay: {
            label: "What is your Google Pay email address/number?",
            placeholder: "type email address or phone number"
        },
        bitcoin: {
            label: "What is your Bitcoin address?",
            placeholder: "address"
        },
        ethereum: {
            label: "What is your Ethereum address?",
            placeholder: "address"
        }
    };

    const { label, placeholder } = identifierQuestions[options.casualPaymentMethod.rawName]

    const name = options.casualPaymentMethod.name.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ")
    const title = `${name} Payment Verification`

    const modal = new ModalBuilder()
        .setCustomId('formModal')
        .setTitle(title)
        .setCustomId(data.toString())

    const identifierInput = new TextInputBuilder()
        .setCustomId('identifier')
        .setLabel(label)
        .setPlaceholder(placeholder)
        .setStyle(TextInputStyle.Short);

    const actionRow = new ActionRowBuilder().addComponents(identifierInput);

    modal.addComponents(<any>actionRow);

    return modal
}