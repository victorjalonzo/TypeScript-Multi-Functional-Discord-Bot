import { IRoleReward } from "./IRoleReward.js";
import { IGuild } from "../../Guild/domain/IGuild.js";
import { IRole } from "../../Role/domain/IRole.js";

export class RoleReward implements IRoleReward {
    public id: string
    public role: IRole
    public invitesRequired: number
    public guildId: string
    public guild: IGuild
    public createdAt: Date = new Date()

    constructor(props: Omit<IRoleReward, "createdAt">){
        this.id = props.id
        this.role = props.role
        this.invitesRequired = props.invitesRequired
        this.guildId = props.guildId
        this.guild = props.guild
    }
}