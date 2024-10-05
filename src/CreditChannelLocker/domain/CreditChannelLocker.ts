import { IGuild } from "../../Guild/domain/IGuild.js";
import { ICreditChannelLocker } from "./ICreditChannelLock.js";

export class CreditChannelLocker implements ICreditChannelLocker {
    id: string
    sourceChannelId: string
    price: number
    updatableMessageId?: string
    description?: string
    media?: Buffer
    mediaCodec?: string
    guild: IGuild
    guildId: string;

    constructor (props: Omit<ICreditChannelLocker, 'guildId'>) {
        this.id = props.id
        this.sourceChannelId = props.sourceChannelId
        this.updatableMessageId = props.updatableMessageId
        this.price = props.price
        this.description = props.description
        this.media = props.media
        this.mediaCodec = props.mediaCodec

        this.guild = props.guild
        this.guildId = props.guild.id
    }
}