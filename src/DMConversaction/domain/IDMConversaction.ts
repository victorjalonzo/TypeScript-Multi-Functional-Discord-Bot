import { IMember } from "../../Member/domain/IMember.js"

export type TState = "WAITING_USER_TO_CONFIRM_MARKED_PAYMENT" | "WAITING_USER_TO_PROVIDE_ACCOUNT_NAME" | "WAITING_USER_TO_PROVIDE_INVOICE" | "WAITING_ADMIN_TO_APPROVE_PAYMENT"

export interface IDMConversaction {
    id: string
	member: IMember
	memberId: string
    guildId: string 
    casualTransactionId?: string | null
	botTurn: boolean
	state?: TState
    createdAt?: Date

    paymentMethodName: string
    paymentMethodValue: string
	paymentFrom?: string
    amount: number
	invoiceAttachments: Buffer[]
}