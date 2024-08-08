import { IGuild } from "../../Guild/domain/IGuild.js"

export type TPaymentMethodType = "Casual" | "Integrated" | "Both"
export type TSaleType = "Credit" | "Roles"

export interface IPaypoint {
    id: string
    image: string
    title: string
    description: string
    payment_method_type: TPaymentMethodType
    sale_type: TSaleType
    messageId?: string
    channelId?: string
    guildId: string
    guild: IGuild
    createdAt: Date
}
