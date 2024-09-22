import {Schema, Document, model} from 'mongoose'
import { IInviteCode } from '../domain/IInviteCode.js'

const inviteCodeSchema = new Schema<Document &IInviteCode>({
    code: {type: String, required: true},
    active: {type: Boolean, required: true},
    guildId: {type: String, required: true},
    guild: {type: Schema.Types.ObjectId, ref: "Guilds", required: true},
    memberId: {type: String, required: true},
    member: {type: Schema.Types.ObjectId, ref: "Members", required: true},
    createdAt: {type: Date, required: true}
})

export const InviteCodeModel = model('InviteCodes', inviteCodeSchema)