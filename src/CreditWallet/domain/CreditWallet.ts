import { IGuild } from "../../Guild/domain/IGuild.js"
import { IMember } from "../../Member/domain/IMember.js"

export class CreditWallet {
    memberId: string
    member: IMember
    credits: number
    guild: IGuild
    guildId: string

    constructor (props: CreditWallet) {
        this.memberId = props.memberId
        this.member = props.member
        this.credits = props.credits
        this.guild = props.guild
        this.guildId = props.guildId
    }
}