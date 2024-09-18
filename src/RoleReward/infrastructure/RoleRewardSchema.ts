import { Schema, model, Document} from 'mongoose'
import {IRoleReward } from '../domain/IRoleReward.js';

const roleRewardSchema = new Schema <IRoleReward & Document>({
    id: { type: String, required: true },
    role: { type: Schema.Types.ObjectId, ref: "Roles", required: true },
    invitesRequired: { type: Number, required: true },
    guildId: { type: String, required: true },
    guild: { type: Schema.Types.ObjectId, ref: "Guilds", required: true }
})

export const RoleRewardModel = model('RoleRewards', roleRewardSchema)