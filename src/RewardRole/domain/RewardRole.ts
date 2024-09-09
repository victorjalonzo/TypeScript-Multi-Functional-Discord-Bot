import { IRewardRole } from "./IRewardRole.js";
import { IGuild } from "../../Guild/domain/IGuild.js";
import { IRole } from "../../Role/domain/IRole.js";

export class RewardRole implements IRewardRole {
    public id: string
    public role: IRole
    public invites: number
    public guildId: string
    public guild: IGuild
    public createdAt: Date = new Date()

    constructor(props: Omit<IRewardRole, "createdAt">){
        this.id = props.id
        this.role = props.role
        this.invites = props.invites
        this.guildId = props.guildId
        this.guild = props.guild
    }
}