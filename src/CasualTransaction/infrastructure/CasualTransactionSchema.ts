import { Document, model, Schema} from "mongoose"
import { ICasualTransaction } from "../domain/ICasualTransaction.js"

const CasualTransactionSchema = new Schema<Document & ICasualTransaction>({
    id: { type: String, required: true, unique: true },
    member: { type: Schema.Types.ObjectId, ref: "Members", required: true },
    memberId: { type: String, required: true },
    guildId: { type: String, required: true },
    state: { type: Number, required: true},
    paymentMethodId: { type: String, default: null },
    paymentMethodName: { type: String, default: null },
    paymentMethodValue: { type: String, default: null },
    productId: { type: String, default: null },
    productName: { type: String, default: null },
    productPrice: { type: Number, default: null },
    productType: { type: String, default: null },
    paymentFrom: { type: String, default: null },
    invoices: { type: [Buffer], default: null },
    createAt: { type: Date, required: true },
    expiredAt: { type: Date, default: null }
})

export const CasualTransactionModel = model<Document & ICasualTransaction>('CasualTransactions', CasualTransactionSchema)
