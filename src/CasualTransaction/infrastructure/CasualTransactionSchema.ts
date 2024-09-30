import { Document, model, Schema} from "mongoose"
import { ICasualTransaction } from "../domain/ICasualTransaction.js"
import { CasualTransactionState } from "../domain/CasualTransactionStateEnums.js"

const CasualTransactionSchema = new Schema<Document & ICasualTransaction>({
    id: { type: String, required: true, unique: true },
    member: { type: Schema.Types.ObjectId, ref: "Members", required: true },
    memberId: { type: String, required: true },
    guild: { type: Schema.Types.ObjectId, ref: "Guilds", required: true },
    guildId: { type: String, required: true },
    state: { type: Number, required: true},
    casualPaymentMethodId: { type: String, default: null },
    casualPaymentMethodName: { type: String, default: null },
    casualPaymentMethodValue: { type: String, default: null },
    productId: { type: String, default: null },
    productName: { type: String, default: null },
    productPrice: { type: Number, default: null },
    productType: { type: String, default: null },
    paymentFrom: { type: String, default: null },
    invoices: { type: [Buffer], default: null },
    createAt: { type: Date, required: true },
    expiredAt: { type: Date, default: null }
})

CasualTransactionSchema.methods.isPending = function() {
    return this.state === CasualTransactionState.PENDING
}

export const CasualTransactionModel = model<Document & ICasualTransaction>('CasualTransactions', CasualTransactionSchema)
