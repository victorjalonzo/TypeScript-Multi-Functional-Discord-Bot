import mongoose, { Schema, Document } from 'mongoose';
import { ICreditProduct } from '../domain/ICreditProduct.js';

const creditProductSchema = new Schema<ICreditProduct & Document>({
    name: { type: String, required: true },
    id: { type: String, required: true },
    price: { type: Number, required: true },
    credits: { type: Number, required: true },
    media: { type: Buffer, default: null },
    mediaFilename: { type: String, default: null },
    description: { type: String, default: null },
    type: { type: String, required: true },
    guildId: { type: String, required: true },
    guild: { type: Schema.Types.ObjectId, ref: "Guilds", required: true },
    createdAt: { type: Date, required: true }
});

export const CreditModel = mongoose.model<ICreditProduct & Document>('CreditProducts', creditProductSchema);