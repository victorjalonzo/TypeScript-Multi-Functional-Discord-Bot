import { IVoiceChannel } from "./IVoiceChannel.js";
import { IGuild } from "../../Guild/domain/IGuild.js";
import { PermissionOverwrite } from "../../shared/domain/IPermissionOverwrite.js";

export class VoiceChannel implements IVoiceChannel {
    constructor (
        public id: string,
        public name: string,
        public position: number,
        public bitrate: number,
        public joinable: boolean,
        public manageable: boolean,
        public permissionOverwrites: PermissionOverwrite[] | [],
        public permissionsLocked: boolean | null,
        public rateLimitPerUser: number | null,
        public rtcRegion: string | null,
        public parentId: string | null,
        public guildId: string,
        public guild: IGuild,
        public createdAt: Date = new Date()
    ){}
}