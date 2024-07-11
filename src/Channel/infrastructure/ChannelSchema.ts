import mongoose, { Schema, Document } from 'mongoose';
import {IChannel} from "../domain/Channel.js";

const channelSchema = new Schema<IChannel & Document>({
    name: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    type: { type: Number, required: true},
    position: { type: Number, required: true},
    permissionOverwrites: Array,
    createdAt: { type: Date, required: true },
    parentId: { type: Number, default: null },
    guildId: { type: String, required: true }
});

export const ChannelModel = mongoose.model<IChannel & Document>('Channel', channelSchema);