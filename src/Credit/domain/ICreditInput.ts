import { ICredit} from "./ICredit.js";
import { Result } from "../../shared/domain/Result.js";

export interface ICreditInput {
    create(credit: ICredit): Promise<Result<ICredit>>
    getAll(filters: Record<string, any>): Promise<Result<ICredit[]>>
    get(filters: Record<string, any>): Promise<Result<ICredit>>
    delete(filters: Record<string, any>): Promise<Result<ICredit>>
}