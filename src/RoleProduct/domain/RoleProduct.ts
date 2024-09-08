import { IRoleProduct } from "./IRoleProduct.js";
import { IRole } from "../../Role/domain/IRole.js";
import { IGuild } from "../../Guild/domain/IGuild.js";

export class RoleProduct implements IRoleProduct {
    id: string
    role: IRole
    price: number
    media?: Buffer | null
    mediaFilename?: string | null | undefined;
    description?: string | null
    guild: IGuild
    guildId: string

    constructor (options: IRoleProduct) {
        this.id = options.id
        this.role = options.role
        this.price = options.price
        this.media = options.media
        this.mediaFilename = options.mediaFilename
        this.description = options.description
        this.guild = options.guild
        this.guildId = options.guildId
    }
}