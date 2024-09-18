import { ICreditChannelLocker } from "./ICreditChannelLock.js";

export class CreditChannelLocker {
    id: string
    sourceChannelId: string
    updatableMessageId: string
    price: number
    description?: string | null
    media?: Buffer | null
    mediaCodec?: string | null

    constructor (props: ICreditChannelLocker) {
        this.id = props.id
        this.sourceChannelId = props.sourceChannelId
        this.updatableMessageId = props.updatableMessageId
        this.price = props.price
        this.description = props.description
        this.media = props.media
        this.mediaCodec = props.mediaCodec
    }
}