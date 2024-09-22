import { IGuild } from "../../Guild/domain/IGuild.js"

export interface IInvitePoint {
    id: string
    title?: string
    description?: string
    media?: Buffer
    mediaCodec?: string
    messageId?: string | null
    channelId?: string | null
    guildId: string
    guild: IGuild
    createdAt: Date
}