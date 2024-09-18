import { IGuild } from "../../Guild/domain/IGuild.js"
import { IMember } from "../../Member/domain/IMember.js"

export interface ICreditWallet {
    memberId: string
    member: IMember
    credits: number
    guild: IGuild
    guildId: string
}