import { Schema, model, Document} from 'mongoose'
import {IRewardRole } from '../domain/IRewardRole.js';

const rewardRoleSchema = new Schema <IRewardRole & Document>({
    roleId: { type: String, required: true },
    invites: { type: Number, required: true },
    guildId: { type: String, required: true },
    guild: { type: Schema.Types.ObjectId, ref: "Guilds", required: true }
})

export const RewardRoleModel = model('RewardRoles', rewardRoleSchema)