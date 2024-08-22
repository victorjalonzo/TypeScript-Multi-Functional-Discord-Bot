import { Paypoint } from "./Paypoint.js";
import { Result } from "../../shared/domain/Result.js";
import { IPaypoint } from "./IPaypoint.js";

export interface IPaypointRepository {
    create(paypoint: Paypoint): Promise<Result<IPaypoint>>
    getAll(guildId: string): Promise<Paypoint[]>
    delete(guildId: string): Promise<Paypoint>
}