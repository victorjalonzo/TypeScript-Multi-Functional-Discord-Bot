import {ITextChannel} from "./ITextChannel.js";
import {IGuild } from "../../Guild/domain/IGuild.js";
import {PermissionOverwrite} from "../../shared/domain/IPermissionOverwrite.js";
import { ICategoryChannel } from "../../CategoryChannel/domain/ICategoryChannel.js";

export class TextChannel implements ITextChannel {
    id: string
    name: string
    position: number
    permissionOverwrites: PermissionOverwrite[] | []
    parent: ICategoryChannel | null
    parentId: string | null
    guildId: string
    guild: IGuild
    createdAt: Date = new Date()
    
    constructor(props: ITextChannel) {
        this.id = props.id
        this.name = props.name
        this.position = props.position
        this.permissionOverwrites = props.permissionOverwrites
        this.parent = props.parent
        this.parentId = props.parentId
        this.guildId = props.guildId
        this.guild = props.guild
    }
}