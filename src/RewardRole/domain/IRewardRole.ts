import { IGuild } from "../../Guild/domain/IGuild.js";

export interface IRewardRole {
    id: string
    roleId: string
    invites: number
    guildId: string
    guild: IGuild
    createdAt: Date
}