import { ICredit} from "./ICredit.js";
import { Result } from "../../shared/domain/Result.js";

export interface ICreditInput {
    create(credit: ICredit): Promise<Result<ICredit>>
    getAll(guildId: string): Promise<Result<ICredit[]>>
    get(id: string): Promise<Result<ICredit>>
    delete(id: string): Promise<Result<ICredit>>
    deleteAll(guildId: string): Promise<Result<ICredit[]>>
}