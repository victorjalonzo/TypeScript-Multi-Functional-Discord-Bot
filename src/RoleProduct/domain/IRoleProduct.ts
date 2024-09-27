import { IRole } from '../../Role/domain/IRole.js';
import { IGuild } from '../../Guild/domain/IGuild.js';
import { ProductType } from '../../shared/domain/ProductTypeEnums.js';

export interface IRoleProduct {
    id: string
    name: string
    role: IRole
    price: number
    media?: Buffer | null
    mediaFilename?: string | null
    description?: string | null
    type: ProductType
    guild: IGuild
    guildId: string
    createdAt: Date
}