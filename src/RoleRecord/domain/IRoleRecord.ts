import { IGuild } from "../../Guild/domain/IGuild.js";

export interface IRoleRecord {
    id: string
    name: string
    position: number
    guildId: string
    guild: IGuild
}