import { IRole } from '../../Role/domain/IRole.js';
import { IPaypoint } from '../../PaypointRole/domain/IPaypointRole.js';

export interface IRoleProduct {
    id: string
    role: IRole
    price: number
    media?: Buffer | null
    mediaFilename?: string | null
    description?: string | null
    paypoint: IPaypoint
    paypointId: string
}