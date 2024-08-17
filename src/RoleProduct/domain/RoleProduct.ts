import { IRoleProduct } from "./IRoleProduct.js";
import { IRole } from "../../Role/domain/IRole.js";
import { IPaypoint } from "../../PaypointRole/domain/IPaypoint.js";

export class RoleProduct implements IRoleProduct {
    id: string
    role: IRole
    price: number
    paypoint: IPaypoint
    paypointId: string

    constructor (options: IRoleProduct) {
        this.id = options.id
        this.role = options.role
        this.price = options.price
        this.paypoint = options.paypoint
        this.paypointId = options.paypointId
    }
}