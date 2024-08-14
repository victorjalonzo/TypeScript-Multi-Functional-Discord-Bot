import { Schema, model, Document } from 'mongoose';
import { IRoleRecord } from '../domain/IRoleRecord.js';

const roleRecordSchema = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    position: { type: Number, required: true },
    color: { type: Number, required: true },
    guildId: { type: String, required: true },
    guild: { type: Schema.Types.ObjectId, ref: "Guilds", required: true }
});

export const RoleRecordModel = model<IRoleRecord & Document>('Roles', roleRecordSchema);