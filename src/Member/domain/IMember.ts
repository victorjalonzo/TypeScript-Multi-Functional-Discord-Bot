import { IGuild } from "../../Guild/domain/IGuild.js"

export interface IMember {
    id: string
    username: string
    discriminator: string
    guildId: string
    guild: IGuild
    avatarURL?: string
    invitedById?: string
    invitedBy?: IMember

    setInvitedBy(inviter: IMember): void
}