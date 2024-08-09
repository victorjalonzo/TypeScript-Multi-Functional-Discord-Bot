import { Schema, model, Document } from 'mongoose';
import { IMember } from '../domain/IMember.js';

const memberSchema = new Schema<IMember & Document>({
    id: { type: String, required: true },
    username: { type: String, required: true },
    discriminator: { type: String, required: true },
    guildId: { type: String, required: true },
    guild: { type: Schema.Types.ObjectId, ref: "Guilds", required: true},
    avatarURL: { type: String, default: null },
    invitedBy: { type: String, default: null },
});

export const memberModel = model<IMember & Document>('Members', memberSchema);