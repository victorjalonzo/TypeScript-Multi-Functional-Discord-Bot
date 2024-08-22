import mongoose, { Schema, Document } from 'mongoose';
import { IPaypoint } from '../domain/IPaypoint.js';

const PaypointSchema = new Schema<IPaypoint & Document>({
    id: { type: String, required: true },
    image: { type: String, default: null},
    title: { type: String, default: null },
    description: { type: String, default: null },
    paymentMethod: { type: String, default: null },
    products: [{ type: Schema.Types.ObjectId, ref: "RoleProducts"}],
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

export const PaypointModel = mongoose.model<IPaypoint & Document>('Paypoints', PaypointSchema);