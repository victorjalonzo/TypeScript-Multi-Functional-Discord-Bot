import { ICasualPayment } from "./ICasualPayment.js";
import { Result } from "../../shared/domain/Result.js";

export interface ICasualPaymentInput {
    create(casualPayment: ICasualPayment): Promise<Result<ICasualPayment>>
    get (id: string, guildId: string): Promise<Result<ICasualPayment>>
    getAll(guildId: string): Promise<Result<ICasualPayment[]>>
    delete({name, guildId }: { name: string, guildId: string }): Promise<Result<Record<string, any>>>
    deleteAll(guildId: string): Promise<Result<ICasualPayment[]>>
}