import { IGuild } from "../../Guild/domain/IGuild.js";

export interface IRole {
    id: string
    name: string
    position: number
    color: number
    permissions: string[]
    hoist: boolean
    mentionable: boolean
    managed : boolean
    editable: boolean
    guildId: string
    guild: IGuild
    createdAt: Date
}