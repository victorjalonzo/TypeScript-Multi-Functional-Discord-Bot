import mongoose, { Schema, Document } from 'mongoose';
import { ICreditProduct } from '../domain/ICreditProduct.js';

const creditSchema = new Schema<ICreditProduct & Document>({
    id: { type: String, required: true },
    price: { type: Number, required: true },
    amount: { type: Number, required: true },
    media: { type: Buffer, default: null },
    codec: { type: String, default: null },
    description: { type: String, default: null },
    guildId: { type: String, required: true },
    guild: { 
        type: Schema.Types.ObjectId, 
        ref: "Guilds", 
        required: true 
    }
});

export const CreditModel = mongoose.model<ICreditProduct & Document>('Credits', creditSchema);