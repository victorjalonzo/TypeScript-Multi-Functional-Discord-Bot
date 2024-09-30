import { IMember } from "../../Member/domain/IMember.js";
import { ICasualTransaction } from "./ICasualTransaction.js";
import { CasualTransactionState } from "./CasualTransactionStateEnums.js";
import { createRandomId } from "../../shared/utils/IDGenerator.js";
import { IRoleProduct } from "../../RoleProduct/domain/IRoleProduct.js";
import { IGuild } from "../../Guild/domain/IGuild.js";
import { ICasualPayment } from "../../CasualPayment/domain/ICasualPayment.js";
import { ICreditProduct } from "../../CreditProduct/domain/ICreditProduct.js";
import { ProductType } from "../../shared/domain/ProductTypeEnums.js";

interface IProps extends Pick<ICasualTransaction, "member" | "guild"  |  "paymentFrom" | "invoices" > {
    casualPaymentMethod: ICasualPayment
    product: IRoleProduct | ICreditProduct
}

export class CasualTransaction implements ICasualTransaction {
    public id: string = createRandomId()
    public member: IMember
    public memberId: string
    public guild: IGuild
    public guildId: string
    public state: CasualTransactionState = CasualTransactionState.PENDING
    public casualPaymentMethodId: string
    public casualPaymentMethodName: string
    public casualPaymentMethodValue: string
    public productId: string
    public productName: string
    public productPrice: number
    public productType: ProductType
    public paymentFrom: string
    public invoices: Buffer[] = []
    public createAt: Date = new Date()
    public expiredAt: Date = new Date()

    constructor(props: IProps) {
        this.member = props.member
        this.memberId = props.member.id

        this.guild = props.guild
        this.guildId = props.guild.id

        this.casualPaymentMethodId = props.casualPaymentMethod.id
        this.casualPaymentMethodName = props.casualPaymentMethod.name
        this.casualPaymentMethodValue = props.casualPaymentMethod.value

        this.productId = props.product.id
        this.productName = props.product.name
        this.productPrice = props.product.price
        this.productType = props.product.type

        this.paymentFrom = props.paymentFrom
        this.invoices = props.invoices

        this.expiredAt.setHours(this.createAt.getHours() + 24);
    }

    isPending (): boolean {
        return this.state === CasualTransactionState.PENDING
    }
}