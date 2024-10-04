import { IGuild } from "../../Guild/domain/IGuild.js";
import { createRandomId } from "../../shared/utils/IDGenerator.js";
import { IInvitePoint } from "./IInvitePoint.js";

interface IProps {
    title?: string
    description?: string
    media?: Buffer
    mediaCodec?: string
    messageId?: string | null
    channelId?: string | null
    guild: IGuild
}

export class InvitePoint implements IInvitePoint {
    id: string = createRandomId()
    title?: string
    description?: string
    media?: Buffer
    mediaCodec?: string
    messageId?: string | null
    channelId?: string | null
    guildId: string
    guild: IGuild
    createdAt: Date = new Date()

    constructor (props:IProps) {
        this.title = props.title
        this.description = props.description
        this.media = props.media
        this.mediaCodec = props.mediaCodec
        this.messageId = props.messageId
        this.channelId = props.channelId
        this.guild = props.guild
        this.guildId = props.guild.id
    }
}