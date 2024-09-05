import { IRole } from "./IRole.js";
import { IGuild } from "../../Guild/domain/IGuild.js";

interface IProps extends Omit<IRole, "createdAt">{}

export class Role implements IRole {
    id: string
    name: string
    position: number
    color: number
    permissions: string[] = []
    hoist: boolean
    mentionable: boolean
    managed : boolean
    editable: boolean
    guildId: string
    guild: IGuild
    createdAt: Date = new Date()

    constructor (props: IProps){
        this.id = props.id
        this.name = props.name
        this.position = props.position
        this.color = props.color
        this.permissions = props.permissions
        this.hoist = props.hoist
        this.mentionable = props.mentionable
        this.managed = props.managed
        this.editable = props.editable
        this.guildId = props.guildId
        this.guild = props.guild
    }
}