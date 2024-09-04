import { IMember } from "../../Member/domain/IMember.js"
import { IRoleProduct } from "../../RoleProduct/domain/IRoleProduct.js"
import { createRandomId } from "../../shared/utils/generate.js"
import { IDMConversaction } from "./IDMConversaction.js"
import { DMConversactionState } from "./DMConversactionStateEnums.js"

interface IOptions extends Omit<IDMConversaction, "id"| "state" | "botTurn" | "invoices" | "history" | "updatableMessageId" | "createdAt"> {}

export class DMConversaction implements IDMConversaction {
    public id: string = createRandomId()
    public member: IMember
    public memberId: string
    public guildId: string
    public paymentMethodName: string
    public paymentMethodValue: string
    public product: IRoleProduct
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
        this.paymentMethodName = options.paymentMethodName
        this.paymentMethodValue = options.paymentMethodValue
        this.product = options.product
    }
}

export const nextState = (DMConversaction: IDMConversaction, botTurn?: boolean): void => {
    DMConversaction.state += 1
    DMConversaction.botTurn = botTurn ? botTurn : true;
}

export const switchTurn = (DMConversaction: IDMConversaction): void => {
    DMConversaction.botTurn = DMConversaction.botTurn ? false : true
}