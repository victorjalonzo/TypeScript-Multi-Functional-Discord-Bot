import { IVoiceChannel } from "./IVoiceChannel.js";
import { IGuild } from "../../Guild/domain/IGuild.js";
import { PermissionOverwrite } from "../../shared/domain/IPermissionOverwrite.js";
import { ICategoryChannel } from "../../CategoryChannel/domain/ICategoryChannel.js";

export class VoiceChannel implements IVoiceChannel {
    id: string
    name: string
    position: number
    bitrate: number
    joinable: boolean
    manageable: boolean
    permissionOverwrites: PermissionOverwrite[] | []
    permissionsLocked: boolean | null
    rateLimitPerUser: number | undefined
    rtcRegion: string | undefined
    parent: ICategoryChannel | null
    parentId: string | null
    guildId: string
    guild: IGuild
    createdAt: Date = new Date()

    constructor (props: IVoiceChannel){
        this.id = props.id
        this.name = props.name
        this.position = props.position
        this.bitrate = props.bitrate
        this.joinable = props.joinable
        this.manageable = props.manageable
        this.permissionOverwrites = props.permissionOverwrites
        this.permissionsLocked = props.permissionsLocked
        this.rateLimitPerUser = props.rateLimitPerUser
        this.rtcRegion = props.rtcRegion
        this.parent = props.parent
        this.parentId = props.parentId
        this.guildId = props.guildId
        this.guild = props.guild
        this.createdAt = props.createdAt
    }
}