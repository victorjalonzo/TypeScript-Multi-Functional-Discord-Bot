import { IGuild } from "../../Guild/domain/IGuild.js"
import { ProductType } from "../../shared/domain/ProductTypeEnums.js"
import { TProductType } from "../../shared/domain/TProductType.js"

export type TPaymentMethodType = "Casual" | "Integrated" | "Both"

export interface IPaypoint {
    id: string
    paymentMethod: TPaymentMethodType
    productType: ProductType
    title?: string
    description?: string
    media?: Buffer
    mediaCodec?: string
    messageId?: string | null
    channelId?: string | null
    guildId: string
    guild: IGuild
    createdAt?: Date

    isBasedOnCreditProduct(): boolean
    isBasedOnRoleProduct(): boolean
}
