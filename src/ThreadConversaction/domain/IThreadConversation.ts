import { IGuild } from "../../Guild/domain/IGuild.js"
import { IMember } from "../../Member/domain/IMember.js"
import { ProductType } from "../../shared/domain/ProductTypeEnums.js"
import { TProductType } from "../../shared/domain/TProductType.js"
import { ThreadConversationState } from "./ThreadConversationStateEnums.js"

export interface IThreadConversation {
    id: string
	member: IMember
	memberId: string
    casualPaymentMethodName: string,
    casualPaymentMethodId: string
    casualPaymentMethodValue: string
    casualTransactionId?: string | null
    productName: string, 
    productId: string,
    productPrice: number,
    productType: ProductType
	botTurn: boolean
	paymentFrom?: string
	state: ThreadConversationState
    history: string[]
    threadChannelId: string
    updatableMessageId?: string
    guild: IGuild
    guildId: string 
	invoices: Buffer[]
    createdAt: Date
}