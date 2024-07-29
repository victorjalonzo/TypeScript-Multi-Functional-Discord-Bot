import mongoose, { Schema, Document } from 'mongoose';
import { ICredit } from '../domain/ICredit.js';

const creditSchema = new Schema<ICredit & Document>({
    price: { type: Number, required: true },
    amount: { type: Number, required: true },
    guildId: { type: String, required: true },
    guild: { 
        type: Schema.Types.ObjectId, 
        ref: "Guilds", 
        required: true 
    }
});

export const CreditModel = mongoose.model<ICredit & Document>('Credits', creditSchema);