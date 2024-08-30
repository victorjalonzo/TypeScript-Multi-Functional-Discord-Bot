import { IMember } from "../../Member/domain/IMember.js"
import { IRoleProduct } from "../../RoleProduct/domain/IRoleProduct.js"
import { createRandomId } from "../../shared/utils/generate.js"
import { IDMConversaction, TState } from "./IDMConversaction.js"

interface IOptions extends Omit<IDMConversaction, "id"| "states" | "botTurn" | "invoiceAttachments" | "history" | "updatableMessageId" | "createdAt"> {}

export class DMConversaction implements IDMConversaction {
    public id: string = createRandomId()
    public member: IMember
    public memberId: string
    public guildId: string
    public paymentMethodName: string
    public paymentMethodValue: string
    public product: IRoleProduct
    public botTurn: boolean = true
    public state: TState = "WAITING_USER_TO_CONFIRM_MARKED_PAYMENT"
    public history: string[] = []
    public paymentFrom?: string | undefined
    public invoiceAttachments: Buffer[] = []
    public casualTransactionId?: string | null = null
    public updatableMessageId?: string
    public createdAt: Date = new Date()

    constructor (options: IOptions) {
        this.member = options.member
        this.memberId = options.memberId
        this.guildId = options.guildId
        this.paymentMethodName = options.paymentMethodName
        this.paymentMethodValue = options.paymentMethodValue
        this.product = options.product
    }
}

export const nextState = (DMConversaction: IDMConversaction, botTurn?: boolean): void => {
    const states = [
        "WAITING_USER_TO_CONFIRM_MARKED_PAYMENT",
        "WAITING_USER_TO_PROVIDE_ACCOUNT_NAME",
        "WAITING_USER_TO_PROVIDE_RECEIPT",
        "WAITING_ADMIN_TO_APPROVE_PAYMENT"
    ]

    const indexState = states.indexOf(<string>DMConversaction.state)
    DMConversaction.state = <TState>states[indexState + 1]
    DMConversaction.botTurn = true
    
    if (botTurn) {
        DMConversaction.botTurn = botTurn
    }
    else {
        DMConversaction.botTurn = true
    }
}

export const switchTurn = (DMConversaction: IDMConversaction): void => {
    if (DMConversaction.botTurn) {
        DMConversaction.botTurn = false
    }
    else {
        DMConversaction.botTurn = true
    }
}