import { ICategoryChannel } from "./ICategoryChannel.js";
import { IGuild } from "../../Guild/domain/IGuild.js";
import { ITextChannel } from "../../TextChannel/domain/ITextChannel.js";
import { IVoiceChannel } from "../../VoiceChannel/domain/IVoiceChannel.js";
import { PermissionOverwrite } from "../../shared/domain/IPermissionOverwrite.js";

export class CategoryChannel implements ICategoryChannel {
    constructor (
        public id: string,
        public name: string,
        public position: number,
        public permissionOverwrites: PermissionOverwrite[] | [],
        public channels: ITextChannel & IVoiceChannel[] | [] = [],
        public guildId: string,
        public guild: IGuild,
        public createdAt: Date = new Date(),
    ){}
}