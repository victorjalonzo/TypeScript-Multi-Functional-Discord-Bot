import { Document, model, Schema } from "mongoose"
import { ICreditChannelLocker } from "../domain/ICreditChannelLock.js"

const CreditChannelLockerSchema = new Schema<Document & ICreditChannelLocker>({
    id: { type: String, required: true },
    sourceChannelId: { type: String, required: true },
    updatableMessageId: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, default: null },
    media: { type: Buffer, default: null },
    mediaCodec: { type: String, default: null }
})

export const CreditChannelLockerModel = model<Document & ICreditChannelLocker>('CreditChannelLocker', CreditChannelLockerSchema)