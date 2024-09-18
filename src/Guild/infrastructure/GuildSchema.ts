import { Schema, model, Document } from 'mongoose';
import { IGuild } from '../domain/IGuild.js'; 

const guildSchema = new Schema<IGuild & Document>({
    name: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    icon: { type: String, default: null },
    createdAt: { type: Date, required: true },
    defaultRole: { type: Schema.Types.ObjectId, ref: "Roles", default: null },
    defaultNotificationChannel: { type: Schema.Types.ObjectId, ref: "TextChannels", default: null },
    defaultInvoiceChannel: { type: Schema.Types.ObjectId, ref: "TextChannels", default: null },
    defaultCredits: { type: Number, default: 0 },
    
    casualPayments: [{type: Schema.Types.ObjectId, ref: "CasualPayments", required: true}],
    credits: [{type: Schema.Types.ObjectId, ref: "Credits", required: true}],
    paypoints: [{type: Schema.Types.ObjectId, ref: "Paypoints", required: true}]
});

export const GuildModel = model<IGuild & Document>('Guilds', guildSchema);