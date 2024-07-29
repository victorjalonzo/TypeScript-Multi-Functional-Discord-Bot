import {IGuild} from "../../Guild/domain/IGuild.js";

export interface ICredit {
    price: number
    amount: number
    guildId: string
    guild: IGuild
    createdAt: Date
}