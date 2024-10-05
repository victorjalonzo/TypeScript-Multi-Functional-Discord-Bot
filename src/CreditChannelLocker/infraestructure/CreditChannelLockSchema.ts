import { Document, model, Schema } from "mongoose"
import { ICreditChannelLocker } from "../domain/ICreditChannelLock.js"

const CreditChannelLockerSchema = new Schema<Document & ICreditChannelLocker>({
    id: { type: String, required: true },
    sourceChannelId: { type: String, required: true },
    updatableMessageId: { type: String, default: null },
    price: { type: Number, required: true },
    description: { type: String, default: null },
    media: { type: Buffer, default: null },
    mediaCodec: { type: String, default: null },
    guild: { type: Schema.Types.ObjectId, ref: "Guilds", required: true },
    guildId: { type: String, required: true }
})

export const CreditChannelLockerModel = model<Document & ICreditChannelLocker>('CreditChannelLocker', CreditChannelLockerSchema)