import { Schema, Document, model} from 'mongoose';
import { IRoleProduct } from '../domain/IRoleProduct.js';

const RoleProductSchema = new Schema<IRoleProduct & Document>({
    id: { type: String, required: true, unique: true },
    role: { type: Schema.Types.ObjectId, ref: "Roles", required: true },
    price: { type: Number, required: true },
    media: { type: Buffer, default: null },
    mediaFilename : { type: String, default: null },
    description: { type: String, default: null },
    guild: { type: Schema.Types.ObjectId, ref: "Guilds", required: true },
    guildId: { type: String, required: true },
})

export const RoleProductModel = model<IRoleProduct & Document>('RoleProducts', RoleProductSchema);