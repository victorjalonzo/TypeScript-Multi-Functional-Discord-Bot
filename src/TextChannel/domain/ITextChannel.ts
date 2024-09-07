import { ICategoryChannel } from "../../CategoryChannel/domain/ICategoryChannel.js"
import { IGuild } from "../../Guild/domain/IGuild.js"
import { PermissionOverwrite } from "../../shared/domain/IPermissionOverwrite.js"

export interface ITextChannel {
    id: string 
    name: string
    position: number
    permissionOverwrites: PermissionOverwrite[] | []
    parent: ICategoryChannel | null
    parentId: string | null
    guildId: string
    guild: IGuild
    createdAt: Date
}