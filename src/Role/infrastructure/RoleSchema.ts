import { Schema, model, Document } from 'mongoose';
import { IRole } from '../domain/IRole.js';

const roleSchema = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    position: { type: Number, required: true },
    color: { type: Number, required: true },
    permissions: { type: [String], required: true },
    hoist: { type: Boolean, required: true },
    mentionable: { type: Boolean, required: true },
    managed : { type: Boolean, required: true },
    editable : { type: Boolean, required: true },
    guildId: { type: String, required: true },
    guild: { type: Schema.Types.ObjectId, ref: "Guilds", required: true },
    createdAt: { type: Date, required: true },
});

export const RoleRecordModel = model<IRole & Document>('Roles', roleSchema);