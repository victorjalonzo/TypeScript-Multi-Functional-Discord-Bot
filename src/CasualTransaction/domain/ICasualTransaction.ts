import { IMember } from "../../Member/domain/IMember.js"
import { IRoleProduct } from "../../RoleProduct/domain/IRoleProduct.js"
import { TProductType } from "../../shared/domain/TProductType.js"
import { CasualTransactionState } from "./CasualTransactionStateEnums.js"

export interface ICasualTransaction {
    id: string
    member: IMember
	memberId: string
	guildId: string
	state: CasualTransactionState
	paymentMethodId: string
	paymentMethodName: string
	paymentMethodValue: string
	productId: string
	productType: TProductType
	productName: string
	productPrice: number
	paymentFrom: string
	invoices: Buffer[]
	createAt: Date
	expiredAt: Date
}