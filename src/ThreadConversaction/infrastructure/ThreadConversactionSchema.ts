import {Document, Schema, model} from "mongoose";
import {IThreadConversation} from "../domain/IThreadConversation.js"

const ThreadConversationSchema = new Schema<IThreadConversation & Document>({
    id: { type: String, required: true, unique: true },
    member: { type: Schema.Types.ObjectId, ref: "Members", required: true },
    memberId: { type: String, required: true },
    guildId: { type: String, required: true },
    casualPaymentMethodId: { type: String, required: true },
    casualPaymentMethodName: { type: String, required: true },
    casualPaymentMethodValue: { type: String, required: true },
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    productPrice: { type: Number, required: true },
    productType: { type: String, required: true },
    botTurn: { type: Boolean, required: true },
    state: { type: Number, required: true },
    history: { type: [String], required: true },
    paymentFrom: { type: String },
    invoices: { type: [Buffer], default: null },
    casualTransactionId: { type: String },
    updatableMessageId: { type: String, default: null },
    createdAt: { type: Date, required: true },

});

export const ThreadConversationModel = model<IThreadConversation & Document>('ThreadConversation', ThreadConversationSchema)