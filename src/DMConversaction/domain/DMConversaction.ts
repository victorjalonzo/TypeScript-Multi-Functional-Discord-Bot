import { IMember } from "../../Member/domain/IMember.js"
import { createRandomId } from "../../shared/utils/IDGenerator.js"
import { IDMConversaction } from "./IDMConversaction.js"
import { DMConversactionState } from "./DMConversactionStateEnums.js"
import { TProductType } from "../../shared/domain/TProductType.js"

interface IOptions extends Omit<IDMConversaction, "id"| "state" | "botTurn" | "invoices" | "history" | "updatableMessageId" | "createdAt"> {}

export class DMConversaction implements IDMConversaction {
    public id: string = createRandomId()
    public member: IMember
    public memberId: string
    public guildId: string
    public casualPaymentMethodId: string
    public casualPaymentMethodName: string
    public casualPaymentMethodValue: string
    public productId: string
    public productName: string
    public productPrice: number
    public productType: TProductType
    public botTurn: boolean = true
    public state: DMConversactionState = DMConversactionState.WAITING_USER_TO_CONFIRM_MARKED_PAYMENT
    public history: string[] = []
    public paymentFrom?: string | undefined
    public invoices: Buffer[] = []
    public casualTransactionId?: string | null = null
    public updatableMessageId?: string
    public createdAt: Date = new Date()

    constructor (options: IOptions) {
        this.member = options.member
        this.memberId = options.memberId
        this.guildId = options.guildId
        this.casualPaymentMethodId = options.casualPaymentMethodId
        this.casualPaymentMethodName = options.casualPaymentMethodName
        this.casualPaymentMethodValue = options.casualPaymentMethodValue
        this.productId = options.productId
        this.productName = options.productName
        this.productPrice = options.productPrice
        this.productType = options.productType
    }
}

export const nextState = (DMConversaction: IDMConversaction, botTurn?: boolean): void => {
    DMConversaction.state += 1
    DMConversaction.botTurn = botTurn ? botTurn : true;
}

export const switchTurn = (DMConversaction: IDMConversaction): void => {
    DMConversaction.botTurn = DMConversaction.botTurn ? false : true
}