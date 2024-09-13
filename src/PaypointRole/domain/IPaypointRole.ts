import { IGuild } from "../../Guild/domain/IGuild.js"
import { IRoleProduct } from "../../RoleProduct/domain/IRoleProduct.js"

export type TPaymentMethodType = "Casual" | "Integrated" | "Both"

export interface IPaypoint {
    id: string
    media?: Buffer
    mediaCodec?: string
    title?: string
    description?: string
    paymentMethod?: TPaymentMethodType
    messageId?: string | null
    channelId?: string | null
    guildId: string
    guild: IGuild
    createdAt?: Date
}
