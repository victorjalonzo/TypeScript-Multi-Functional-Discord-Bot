import { Schema, model, Document } from 'mongoose';
import { IGuild } from '../domain/IGuild.js'; 

const guildSchema = new Schema<IGuild & Document>({
    name: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    icon: { type: String, default: null },
    createdAt: { type: Date, required: true },
    
    casualPayments: [{type: Schema.Types.ObjectId, ref: "CasualPayments", required: true}]
});

export const GuildModel = model<IGuild & Document>('Guilds', guildSchema);