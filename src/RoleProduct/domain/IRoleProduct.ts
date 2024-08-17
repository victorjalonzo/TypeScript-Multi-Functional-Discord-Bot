import { IRole } from '../../Role/domain/IRole.js';
import { IPaypoint } from '../../PaypointRole/domain/IPaypoint.js';

export interface IRoleProduct {
    id: string
    role: IRole
    price: number
    paypoint: IPaypoint
    paypointId: string
}