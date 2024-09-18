import {IGuild} from "../../Guild/domain/IGuild.js";

export interface ICreditProduct {
    id: string
    name: string
    price: number
    credits: number
    media?: Buffer | null
    mediaFilename?: string | null
    description?: string | null
    guild: IGuild
    guildId: string
    createdAt: Date
}