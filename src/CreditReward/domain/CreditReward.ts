import { IGuild } from "../../Guild/domain/IGuild.js";
import { createRandomId } from "../../shared/utils/IDGenerator.js";
import { ICreditReward } from "./ICreditReward.js";

interface IProps {
    credits: number
    invitesRequired: number
    guild: IGuild
}

export class CreditReward implements ICreditReward {
    public id: string = createRandomId()
    public name: string
    public credits: number
    public invitesRequired: number
    public guildId: string
    public guild: IGuild
    public createdAt: Date = new Date()

    constructor (props: IProps) {
        this.name = `${props.credits} credits`
        this.credits = props.credits
        this.invitesRequired = props.invitesRequired
        this.guild = props.guild
        this.guildId = props.guild.id
    }
}