import {IGuild} from "../../Guild/domain/IGuild.js";
import { ProductType } from "../../shared/domain/ProductTypeEnums.js";

export interface ICreditProduct {
    id: string
    name: string
    price: number
    credits: number
    media?: Buffer | null
    mediaFilename?: string | null
    description?: string | null
    type: ProductType 
    guild: IGuild
    guildId: string
    createdAt: Date
}