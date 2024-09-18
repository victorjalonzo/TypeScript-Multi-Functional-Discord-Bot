import { IPaypoint } from "./IPaypoint.js";
import { Result } from "../../shared/domain/Result.js";

export interface IPaypointInput {
    create(paypoint: IPaypoint): Promise<Result<IPaypoint>>
    update(paypoint: IPaypoint): Promise<Result<IPaypoint>>
    get(guildId: string): Promise<Result<IPaypoint>>
    getByMessageID(messageID: string): Promise<Result<IPaypoint>>
    getAll(guildId: string): Promise<Result<IPaypoint[]>>
    delete(guildId: string): Promise<Result<IPaypoint>>
}