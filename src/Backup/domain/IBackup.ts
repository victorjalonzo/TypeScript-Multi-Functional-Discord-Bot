import { IGuild } from "../../Guild/domain/IGuild.js"

export interface IBackup {
    name: string
    guildId: string
    guild: IGuild,
    createdBy: string
    createdAt: Date
}