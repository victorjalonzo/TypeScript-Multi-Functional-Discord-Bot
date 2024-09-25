import { IMember } from "./IMember.js";
import { IGuild } from "../../Guild/domain/IGuild.js";

interface IProps extends Omit<IMember, "guildId" | "invitedById" | "setInvitedBy"> {}

export class Member implements IMember {
    id: string
    username: string
    discriminator: string
    guildId: string
    guild: IGuild
    avatarURL?: string
    invitedById?: string
    invitedBy?: IMember

    constructor (props: IProps){
        this.id = props.id
        this.username = props.username
        this.discriminator = props.discriminator
        this.guild = props.guild
        this.guildId = props.guild.id
        this.avatarURL = props.avatarURL
        this.invitedBy = props.invitedBy
        this.invitedById = props.invitedBy?.id
    }

    setInvitedBy(inviter: IMember): void {
        this.invitedBy = inviter
        this.invitedById = inviter.id
    }
}