import mongoose, { Schema, Document } from 'mongoose';
import { IPaypoint } from '../domain/IPaypoint.js';

const PaypointSchema = new Schema<IPaypoint & Document>({
    image: { type: String, required: true },
    description: { type: String, required: true },
    payment_method_type: { type: String, required: true },
    sale_type: { type: String, required: true },
    messageId: { type: String, default: null },
    channelId: { type: String, default: null },
    createdAt: { type: Date, required: true },
    guildId: { type: String, required: true },
    guild: { 
        type: Schema.Types.ObjectId, 
        ref: "Guilds", 
        required: true 
    }
});

export const CreditModel = mongoose.model<IPaypoint & Document>('Paypoint', PaypointSchema);