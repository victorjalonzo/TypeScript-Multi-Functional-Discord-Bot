import { IMember } from "../../Member/domain/IMember.js"
import { createRandomId } from "../../shared/utils/generate.js"
import { IDMConversaction, TState } from "./IDMConversaction.js"

interface IProps extends Omit<IDMConversaction, "id"| "states" | "botTurn" | "invoiceAttachments" | "history"> {}

export class DMConversaction implements IDMConversaction {
    public id: string = createRandomId()
    public member: IMember
    public memberId: string
    public guildId: string
    public paymentMethodName: string
    public paymentMethodValue: string
    public amount: number
    public botTurn: boolean = true
    public state: TState = "WAITING_USER_TO_CONFIRM_MARKED_PAYMENT"
    public history: string[] = []
    public paymentFrom?: string | undefined
    public invoiceAttachments: Buffer[] = []
    public casualTransactionId?: string | null = null
    public createdAt?: Date = new Date()

    constructor (props: IProps) {
        this.member = props.member
        this.memberId = props.memberId
        this.guildId = props.guildId
        this.paymentMethodName = props.paymentMethodName
        this.paymentMethodValue = props.paymentMethodValue
        this.amount = props.amount

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