import { IMember } from "../../Member/domain/IMember.js";
import { ICasualTransaction, TState } from "./ICasualTransaction.js";
import { createRandomId } from "../../shared/utils/generate.js";

export class CasualTransaction implements ICasualTransaction {
    public id: string = createRandomId()
    public member: IMember
    public memberId: string
    public guildId: string
    public state: TState
    public paymentMethodName: string
    public paymentMethodValue: string
    public paymentFrom?: string
    public amount?: string
    public invoices?: Buffer[]
    public createAt: Date = new Date()
    public expiredAt?: Date

    
    constructor(options: Omit<ICasualTransaction, "id">) {
        this.member = options.member
        this.memberId = options.memberId
        this.guildId = options.guildId
        this.state = options.state
        this.paymentMethodName = options.paymentMethodName
        this.paymentMethodValue = options.paymentMethodValue
        this.paymentFrom = options.paymentFrom
        this.amount = options.amount
        this.invoices = options.invoices
        this.expiredAt = options.expiredAt
    }
}