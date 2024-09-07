import { Schema, Document, model} from "mongoose"
import {IVoiceChannel} from "../domain/IVoiceChannel.js"

const VoiceChannelSchema = new Schema <IVoiceChannel & Document>({
    name: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    position: { type: Number, required: true},
    bitrate: { type: Number, required: true},
    joinable: { type: Boolean, required: true},
    manageable: { type: Boolean, required: true},
    permissionOverwrites: Array,
    permissionsLocked: { type: Boolean, default: null },
    rateLimitPerUser: { type: Number, default: null },
    rtcRegion: { type: String, default: null },
    parent: { type: Schema.Types.ObjectId, ref: "CategoryChannels", default: null },
    parentId: { type: String, default: null },
    guildId: { type: String, required: true },
    guild: { type: Schema.Types.ObjectId, ref: "Guilds", required: true },
    createdAt: { type: Date, required: true },
})

export const VoiceChannelModel = model<IVoiceChannel & Document>('VoiceChannels', VoiceChannelSchema)