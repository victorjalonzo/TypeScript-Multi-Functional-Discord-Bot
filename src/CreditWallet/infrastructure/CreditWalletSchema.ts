import { Schema, Document, model} from "mongoose";
import { ICreditWallet } from "../domain/ICreditWallet.js";

const CreditWalletSchema = new Schema<ICreditWallet & Document>({
    member: { type: Object, required: true, ref: 'Members' },
    memberId: { type: String, required: true },
    guild: { type: Object, required: true, ref: 'Guilds' },
    guildId: { type: String, required: true },
    credits: { type: Number, required: true },
    creditRewardChallengesCompleted: [{type: Schema.Types.ObjectId, ref: "CreditRewards"}]
})

export const CreditWalletModel = model<ICreditWallet & Document>('CreditWallets', CreditWalletSchema)