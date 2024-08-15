import { IGuild } from "../../Guild/domain/IGuild.js";
import { ITextChannel } from "../../TextChannel/domain/ITextChannel.js";
import { IVoiceChannel } from "../../VoiceChannel/domain/IVoiceChannel.js";
import { PermissionOverwrite } from "../../shared/domain/IPermissionOverwrite.js";


export interface ICategoryChannel {
    id: string
    name: string
    position: number
    permissionOverwrites: PermissionOverwrite[] | []
    channels: ITextChannel & IVoiceChannel[] | [],
    guildId: string
    guild: IGuild
    createdAt: Date
}