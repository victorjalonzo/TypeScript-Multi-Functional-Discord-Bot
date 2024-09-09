import { IGuild } from "../../Guild/domain/IGuild.js";
import { IRole } from "../../Role/domain/IRole.js";

export interface IRewardRole {
    id: string
    role: IRole
    invites: number
    guildId: string
    guild: IGuild
    createdAt: Date
}