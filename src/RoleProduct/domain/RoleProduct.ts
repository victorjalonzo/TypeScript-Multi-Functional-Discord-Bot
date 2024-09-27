import { IRoleProduct } from "./IRoleProduct.js";
import { IRole } from "../../Role/domain/IRole.js";
import { IGuild } from "../../Guild/domain/IGuild.js";
import { ProductType } from "../../shared/domain/ProductTypeEnums.js";

interface IProps extends Omit<IRoleProduct, "id" | "name" | "type" | "guildId" | "createdAt">{}

export class RoleProduct implements IRoleProduct {
    id: string
    name: string
    role: IRole
    price: number
    media?: Buffer | null
    mediaFilename?: string | null | undefined;
    description?: string | null
    type: ProductType = ProductType.ROLE
    guild: IGuild
    guildId: string
    createdAt: Date = new Date()

    constructor (options: IProps) {
        this.id = options.role.id
        this.name = options.role.name
        this.role = options.role
        
        this.price = options.price
        this.media = options.media
        this.mediaFilename = options.mediaFilename
        this.description = options.description

        this.guild = options.guild
        this.guildId = options.guild.id
    }
}