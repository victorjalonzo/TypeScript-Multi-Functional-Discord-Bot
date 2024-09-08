import { IRoleProduct } from "./IRoleProduct.js"
import { Result } from "../../shared/domain/Result.js"

export interface IRoleProductInput {
    create (roleProduct: IRoleProduct): Promise<Result<IRoleProduct>>
    getAll (guildId: string): Promise<Result<IRoleProduct[]>>
    get (id: string): Promise<Result<IRoleProduct>>
    delete (id: string): Promise<Result<IRoleProduct>>
}