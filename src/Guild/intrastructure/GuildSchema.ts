import mongoose, { Schema, Document } from 'mongoose';
import { IGuild } from '../domain/IGuild.js'; 

const guildSchema = new Schema<IGuild & Document>({
    name: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    icon: { type: String, default: null },
    createdAt: { type: Date, required: true },
    
    casualPayments: [{type: Schema.Types.ObjectId, ref: "CasualPayment", required: true}]
});

export const GuildModel = mongoose.model<IGuild & Document>('Guild', guildSchema);