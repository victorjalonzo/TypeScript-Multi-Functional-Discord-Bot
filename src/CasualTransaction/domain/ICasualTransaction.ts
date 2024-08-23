import { IMember } from "../../Member/domain/IMember.js"

export type TState = "UNCONFIRMED" | "CANCELLED" | "INCOMPLETE" |  "PENDING" | "APPROVED" | "REJECTED"


export interface ICasualTransaction {
    id: string
    member: IMember
	memberId: string
	guildId: string
	state: TState 
	paymentMethodName: string
	paymentMethodValue: string
	paymentFrom?: string
	amount?: string
	invoices?: Buffer[]
	createAt?: Date
	expiredAt?: Date
}