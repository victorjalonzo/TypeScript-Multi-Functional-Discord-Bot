import { IRole } from '../../Role/domain/IRole.js';
import { IGuild } from '../../Guild/domain/IGuild.js';

export interface IRoleProduct {
    id: string
    role: IRole
    price: number
    media?: Buffer | null
    mediaFilename?: string | null
    description?: string | null
    guild: IGuild
    guildId: string
}