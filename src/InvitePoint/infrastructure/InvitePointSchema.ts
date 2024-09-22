import {Schema, Document, model} from 'mongoose'
import {IInvitePoint} from "../domain/IInvitePoint.js";

const invitePointSchema = new Schema<IInvitePoint & Document>({
    title: { type: String, default: null },
    description: { type: String, default: null },
    media: { type: Buffer, default: null},
    mediaCodec: { type: String, default: null},
    messageId: { type: String, default: null },
    channelId: { type: String, default: null },
    guildId: { type: String, required: true },
    guild: { type: Schema.Types.ObjectId, ref: "Guilds", required: true },
    createdAt: { type: Date, required: true }
});

export const InvitePointModel = model<IInvitePoint & Document>('InvitePoints', invitePointSchema)