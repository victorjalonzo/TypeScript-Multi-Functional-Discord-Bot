import { IMember } from "./IMember.js";
import { IGuild } from "../../Guild/domain/IGuild.js";

export class Member implements IMember {
    id: string
    username: string
    discriminator: string
    guildId: string
    guild: IGuild
    avatarURL?: string | null
    invitedBy?: string | null

    constructor (props: IMember){
        this.id = props.id
        this.username = props.username
        this.discriminator = props.discriminator
        this.guildId = props.guildId
        this.guild = props.guild
        this.avatarURL = props.avatarURL
        this.invitedBy = props.invitedBy
    }
}