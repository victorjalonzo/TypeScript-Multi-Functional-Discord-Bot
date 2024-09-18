import { IGuild } from "../../Guild/domain/IGuild.js"
import { IRoleProduct } from "../../RoleProduct/domain/IRoleProduct.js"
import { TProductType } from "../../shared/domain/TProductType.js"

export type TPaymentMethodType = "Casual" | "Integrated" | "Both"

export interface IPaypoint {
    id: string
    paymentMethod: TPaymentMethodType
    productType: TProductType
    title?: string
    description?: string
    media?: Buffer
    mediaCodec?: string
    messageId?: string | null
    channelId?: string | null
    guildId: string
    guild: IGuild
    createdAt?: Date
}
