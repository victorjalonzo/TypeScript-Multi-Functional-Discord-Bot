import { IMember } from "../../Member/domain/IMember.js";
import { ICasualTransaction, TState } from "./ICasualTransaction.js";
import { createRandomId } from "../../shared/utils/generate.js";

interface IOptions extends Omit<ICasualTransaction, "id" | "expiredAt" | "createAt"> {}

export class CasualTransaction implements ICasualTransaction {
    public id: string = createRandomId()
    public member: IMember
    public memberId: string
    public guildId: string
    public state: TState
    public paymentMethodName: string
    public paymentMethodValue: string
    public paymentFrom: string
    public amount: number
    public invoices: Buffer[]
    public createAt: Date = new Date()
    public expiredAt: Date = new Date()

    constructor(options: IOptions) {
        this.member = options.member
        this.memberId = options.memberId
        this.guildId = options.guildId
        this.state = options.state
        this.paymentMethodName = options.paymentMethodName
        this.paymentMethodValue = options.paymentMethodValue
        this.paymentFrom = options.paymentFrom
        this.amount = options.amount
        this.invoices = options.invoices

        this.expiredAt.setHours(this.createAt.getHours() + 24);
    }
}