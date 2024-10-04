import { ICreditReward } from "../../CreditReward/domain/ICreditReward.js"
import { IGuild } from "../../Guild/domain/IGuild.js"
import { IMember } from "../../Member/domain/IMember.js"
import { ICreditWallet } from "./ICreditWallet.js"

interface IProps {
    member: IMember
    guild: IGuild
    credits: number,
    creditRewardChallengesCompleted?: ICreditReward[]
}

export class CreditWallet implements ICreditWallet {
    memberId: string
    member: IMember
    credits: number
    creditRewardChallengesCompleted: ICreditReward[]
    guild: IGuild
    guildId: string

    constructor (props: IProps) {
        this.member = props.member
        this.memberId = props.member.id
        this.guild = props.guild
        this.guildId = props.guild.id
        this.credits = props.credits
        this.creditRewardChallengesCompleted = props.creditRewardChallengesCompleted ?? []
    }
}