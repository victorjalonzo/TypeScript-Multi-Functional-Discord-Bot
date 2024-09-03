import { IMember } from "../../Member/domain/IMember.js";
import { ICasualTransaction } from "./ICasualTransaction.js";
import { CasualTransactionState } from "./CasualTransactionStateEnums.js";
import { createRandomId } from "../../shared/utils/generate.js";
import { IRoleProduct } from "../../RoleProduct/domain/IRoleProduct.js";

interface IOptions extends Omit<ICasualTransaction, "id" | "expiredAt" | "createAt"> {}

export class CasualTransaction implements ICasualTransaction {
    public id: string = createRandomId()
    public member: IMember
    public memberId: string
    public guildId: string
    public state: CasualTransactionState
    public paymentMethodName: string
    public paymentMethodValue: string
    public product: IRoleProduct;
    public paymentFrom: string
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
        this.product = options.product
        this.paymentFrom = options.paymentFrom
        this.invoices = options.invoices

        this.expiredAt.setHours(this.createAt.getHours() + 24);
    }
}