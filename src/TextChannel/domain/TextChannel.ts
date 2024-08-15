import {ITextChannel} from "./ITextChannel.js";
import {IGuild } from "../../Guild/domain/IGuild.js";
import {PermissionOverwrite} from "../../shared/domain/IPermissionOverwrite.js";

export class TextChannel implements ITextChannel {
    constructor(
        public id: string,
        public name: string,
        public position: number,
        public permissionOverwrites: PermissionOverwrite[] | [],
        public parentId: string | null,
        public guildId: string,
        public guild: IGuild,
        public createdAt: Date = new Date(),
    ) {}
}