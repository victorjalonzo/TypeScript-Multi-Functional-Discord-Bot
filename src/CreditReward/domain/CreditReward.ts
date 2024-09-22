import { IGuild } from "../../Guild/domain/IGuild.js";
import { createRandomId } from "../../shared/utils/IDGenerator.js";
import { ICreditReward } from "./ICreditReward.js";

export class CreditReward implements ICreditReward {
    public id: string = createRandomId()
    public name: string
    public credits: number
    public invitesRequired: number
    public guildId: string
    public guild: IGuild
    public createdAt: Date = new Date()

    constructor (props: Omit<ICreditReward, "id" | "name" |"createdAt">) {
        this.name = `${props.credits} credits`
        this.credits = props.credits
        this.invitesRequired = props.invitesRequired
        this.guildId = props.guildId
        this.guild = props.guild
    }
}