import {Document, Schema, model} from "mongoose";
import {IDMConversaction} from "../domain/IDMConversaction.js"

const DMConversactionSchema = new Schema<IDMConversaction & Document>({
    id: { type: String, required: true, unique: true },
    member: { type: Schema.Types.ObjectId, ref: "Members", required: true },
    memberId: { type: String, required: true },
    guildId: { type: String, required: true },
    paymentMethodName: { type: String, required: true },
    paymentMethodValue: { type: String, required: true },
    product: { type: Schema.Types.ObjectId, ref: "RoleProducts", required: true },
    botTurn: { type: Boolean, required: true },
    state: { type: Number, required: true },
    history: { type: [String], required: true },
    paymentFrom: { type: String },
    invoices: { type: [Buffer], default: null },
    casualTransactionId: { type: String },
    updatableMessageId: { type: String, default: null },
    createdAt: { type: Date, required: true },

});

export const DMConversactionModel = model<IDMConversaction & Document>('DMConversaction', DMConversactionSchema)