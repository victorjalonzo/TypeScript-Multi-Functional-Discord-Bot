import { IMember } from "../../Member/domain/IMember.js"
import { IRoleProduct } from "../../RoleProduct/domain/IRoleProduct.js"
import { DMConversactionState } from "./DMConversactionStateEnums.js"

export interface IDMConversaction {
    id: string
	member: IMember
	memberId: string
    guildId: string 
    casualTransactionId?: string | null
	botTurn: boolean
	state: DMConversactionState
    history: string[]
    paymentMethodName: string
    paymentMethodValue: string
    product: IRoleProduct
	paymentFrom?: string
    updatableMessageId?: string
	invoices: Buffer[]
    createdAt: Date
}