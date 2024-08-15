import { ICategoryChannel } from "../domain/ICategoryChannel.js";
import { Schema, Document, model } from "mongoose";

const categoryChannelSchema = new Schema<ICategoryChannel & Document>({
    name: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    position: { type: Number, required: true },
    permissionOverwrites: Array,
    channels: [
        { type: Schema.Types.ObjectId, ref: "TexChannels", required: true }, 
        { type: Schema.Types.ObjectId, ref: "VoiceChannels", required: true }],
    createdAt: { type: Date, required: true },
    guildId: { type: String, required: true },
});

export const CategoryChannelModel = model<ICategoryChannel & Document>('CategoryChannels', categoryChannelSchema)