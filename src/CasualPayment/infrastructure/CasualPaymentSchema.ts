import mongoose, { Schema, Document } from 'mongoose';
import { ICasualPayment } from "../domain/ICasualPayment.js";

const casualPaymentSchema = new Schema<ICasualPayment & Document>({
    name: { type: String, required: true },
    value: { type: String, required: true },
    guildId: { type: String, required: true },
    guild: { type: Schema.Types.ObjectId, ref: "Guilds", required: true },
    rawName: { type: String, required: true }
});

export const CasualPaymentModel = mongoose.model<ICasualPayment & Document>('CasualPayment', casualPaymentSchema);