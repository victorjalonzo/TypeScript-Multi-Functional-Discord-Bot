import { IMember } from "../../Member/domain/IMember.js"
import { IRoleProduct } from "../../RoleProduct/domain/IRoleProduct.js"
import { CasualTransactionState } from "./CasualTransactionStateEnums.js"

export interface ICasualTransaction {
    id: string
    member: IMember
	memberId: string
	guildId: string
	state: CasualTransactionState 
	paymentMethodName: string
	paymentMethodValue: string
	product: IRoleProduct
	paymentFrom: string
	invoices: Buffer[]
	createAt: Date
	expiredAt: Date
}