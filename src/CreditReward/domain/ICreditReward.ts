import { IGuild } from "../../Guild/domain/IGuild.js"

export interface ICreditReward {
    id: string
    name: string
    credits: number
    invitesRequired: number
    guildId: string
    guild: IGuild
    createdAt: Date
}