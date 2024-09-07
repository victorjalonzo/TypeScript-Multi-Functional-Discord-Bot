import { ICategoryChannel } from "../../CategoryChannel/domain/ICategoryChannel.js";
import { IGuild } from "../../Guild/domain/IGuild.js";
import { PermissionOverwrite } from "../../shared/domain/IPermissionOverwrite.js";

export interface IVoiceChannel {
    id: string
    name: string
    position: number
    bitrate: number,
    joinable: boolean,
    manageable: boolean,
    permissionOverwrites: PermissionOverwrite[] | []
    permissionsLocked: boolean | null,
    rateLimitPerUser?: number
    rtcRegion?: string
    parent: ICategoryChannel | null
    parentId: string | null
    guildId: string
    guild: IGuild
    createdAt: Date
}