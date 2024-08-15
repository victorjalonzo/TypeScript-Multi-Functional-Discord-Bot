import {Schema, Document, model} from "mongoose"
import { ITextChannel } from "../domain/ITextChannel.js";

const TextChannelSchema = new Schema<ITextChannel & Document>({
    name: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    position: { type: Number, required: true},
    permissionOverwrites: Array,
    parentId: { type: Number, default: null },
    guildId: { type: String, required: true },
    createdAt: { type: Date, required: true },
});

export const TextChannelModel = model<ITextChannel & Document>('TextChannels', TextChannelSchema);