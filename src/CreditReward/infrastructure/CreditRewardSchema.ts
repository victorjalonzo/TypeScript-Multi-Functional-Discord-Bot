import {Schema, model, Document} from 'mongoose'
import {ICreditReward} from "../domain/ICreditReward.js";

const creditRewardSchema = new Schema<ICreditReward & Document>({
    id: { type: String, required: true },
    name: { type: String, required: true },
    credits: { type: Number, required: true },
    invitesRequired: { type: Number, required: true },
    guildId: { type: String, required: true },
    guild: { type: Schema.Types.ObjectId, ref: "Guilds", required: true },
    createdAt: { type: Date, required: true }
});

export const CreditRewardModel = model<ICreditReward & Document>('CreditRewards', creditRewardSchema)