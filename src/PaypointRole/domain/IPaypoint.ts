import { IGuild } from "../../Guild/domain/IGuild.js"
import { IRoleProduct } from "../../RoleProduct/domain/IRoleProduct.js"

export type TPaymentMethodType = "Casual" | "Integrated" | "Both"

export interface IPaypoint {
    id: string
    image?: string
    title?: string
    description?: string
    paymentMethod?: TPaymentMethodType
    products: IRoleProduct[]
    messageId?: string
    channelId?: string
    guildId: string
    guild: IGuild
    createdAt?: Date
}