import {IGuild} from "../../Guild/domain/IGuild.js";

export interface ICredit {
    id: string
    price: number
    amount: number
    media?: Buffer | null
    codec?: string | null
    description?: string | null
    guild: IGuild
    guildId: string
    createdAt: Date
}