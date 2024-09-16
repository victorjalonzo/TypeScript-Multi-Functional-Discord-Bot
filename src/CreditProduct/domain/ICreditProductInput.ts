import { ICreditProduct} from "./ICreditProduct.js";
import { Result } from "../../shared/domain/Result.js";

export interface ICreditProductInput {
    create(credit: ICreditProduct): Promise<Result<ICreditProduct>>
    getAll(guildId: string): Promise<Result<ICreditProduct[]>>
    get(id: string): Promise<Result<ICreditProduct>>
    delete(id: string): Promise<Result<ICreditProduct>>
    deleteAll(guildId: string): Promise<Result<ICreditProduct[]>>
}