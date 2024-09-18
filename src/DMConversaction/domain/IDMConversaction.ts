import { IMember } from "../../Member/domain/IMember.js"
import { TProductType } from "../../shared/domain/TProductType.js"
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
    casualPaymentMethodName: string,
    casualPaymentMethodId: string
    casualPaymentMethodValue: string
    productName: string, 
    productId: string,
    productPrice: number,
    productType: TProductType
	paymentFrom?: string
    updatableMessageId?: string
	invoices: Buffer[]
    createdAt: Date
}