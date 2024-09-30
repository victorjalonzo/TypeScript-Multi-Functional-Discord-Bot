import { IGuild } from "../../Guild/domain/IGuild.js"
import { IMember } from "../../Member/domain/IMember.js"
import { ProductType } from "../../shared/domain/ProductTypeEnums.js"
import { CasualTransactionState } from "./CasualTransactionStateEnums.js"

export interface ICasualTransaction {
    id: string
    member: IMember
	memberId: string
	guild: IGuild
	guildId: string
	state: CasualTransactionState
	casualPaymentMethodId: string
	casualPaymentMethodName: string
	casualPaymentMethodValue: string
	productId: string
	productName: string
	productType: ProductType
	productPrice: number
	paymentFrom: string
	invoices: Buffer[]
	createAt: Date
	expiredAt: Date

	isPending(): boolean
}