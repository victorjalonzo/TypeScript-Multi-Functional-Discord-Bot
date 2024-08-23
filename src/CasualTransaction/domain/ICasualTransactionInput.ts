import { Result } from "../../shared/domain/Result.js";
import { ICasualTransaction } from "./ICasualTransaction.js";

export interface ICasualTransactionInput {
    create(casualTransaction: ICasualTransaction): Promise<Result<ICasualTransaction>>
    getAllByGuild(guildId: string): Promise<Result<ICasualTransaction[]>>
    getAllByMemberOnGuild(memberId: string, guildId: string): Promise<Result<ICasualTransaction[]>>
    getAllByMember(memberId: string): Promise<Result<ICasualTransaction[]>>
    getLastOneByMember(memberId: string): Promise<Result<ICasualTransaction>>
    delete(id: string): Promise<Result<ICasualTransaction>>
}