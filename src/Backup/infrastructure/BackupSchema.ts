import {Document, model, Schema} from "mongoose";
import {IBackup} from "../domain/IBackup.js";

const backupSchema = new Schema<IBackup & Document>({
    name: { type: String, required: true },
    guildId: { type: String, required: true },
    guild: { type: Schema.Types.ObjectId, ref: "Guilds", required: true },
    createdBy: { type: String, required: true },
    createdAt: { type: Date, required: true }
});

export const BackupModel = model<IBackup & Document>('Backups', backupSchema)