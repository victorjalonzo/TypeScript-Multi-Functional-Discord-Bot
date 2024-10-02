import {Document, Schema, model} from "mongoose";
import {IThreadConversation} from "../domain/IThreadConversation.js"
import { ThreadConversationState } from "../domain/ThreadConversationStateEnums.js";

const ThreadConversationSchema = new Schema<IThreadConversation & Document>({
    id: { type: String, required: true, unique: true },
    member: { type: Schema.Types.ObjectId, ref: "Members", required: true },
    memberId: { type: String, required: true },
    guild: { type: Schema.Types.ObjectId, ref: "Guilds", required: true },
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
    threadChannelId: { type: String, required: true },
    casualTransactionId: { type: String },
    updatableMessageId: { type: String, default: null },
    createdAt: { type: Date, required: true },

});

ThreadConversationSchema.methods.isWaitingAdminApproval = function () {
    return this.state === ThreadConversationState.WAITING_ADMIN_TO_APPROVE_PAYMENT
}

ThreadConversationSchema.methods.isWaitingUserPaymentReceipt = function () {
    return this.state === ThreadConversationState.WAITING_USER_TO_PROVIDE_RECEIPT_IMAGE
}

ThreadConversationSchema.methods.isClosed = function () {
    return this.state === ThreadConversationState.CLOSED
}

ThreadConversationSchema.methods.isCancelled = function () {
    return this.state === ThreadConversationState.CANCELLED
}

export const ThreadConversationModel = model<IThreadConversation & Document>('ThreadConversation', ThreadConversationSchema)