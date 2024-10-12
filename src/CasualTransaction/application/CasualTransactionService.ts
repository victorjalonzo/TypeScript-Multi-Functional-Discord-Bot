import { IRepository } from "../../shared/domain/IRepository.js";
import { Result } from "../../shared/domain/Result.js";
import { ICasualTransaction } from "../domain/ICasualTransaction.js";
import { CasualTransactionCreationError, CasualTransactionDeletionError, CasualTransactionNotFoundError, CasualTransactionUpdateError } from "../domain/CasualTransactionExceptions.js";
import { ICasualTransactionInput } from "../domain/ICasualTransactionInput.js";

export class CasualTransactionService implements ICasualTransactionInput{

    constructor(private repository: IRepository<ICasualTransaction>) {}

    create = async (casualTransaction: ICasualTransaction): Promise<Result<ICasualTransaction>> => {
        try {
            return await this.repository.create(casualTransaction)
            .then(r => r ? Result.success(r) : Promise.reject(r))
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    get = async (id: string): Promise<Result<ICasualTransaction>> => {
        try {
            return await this.repository.get({id})
            .then(r => r ? Result.success(r) : Promise.reject(new CasualTransactionNotFoundError()))
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    getAllByGuild = async (guildId: string): Promise<Result<ICasualTransaction[]>> => {
        try {
            const transactions = await this.repository.getAll({guildId});
            return Result.success(transactions);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    getAllByMemberOnGuild = async (memberId: string, guildId: string): Promise<Result<ICasualTransaction[]>> => {
        try {
            const transactions = await this.repository.getAll({memberId, guildId});
            return Result.success(transactions);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    getAllByMember = async (memberId: string): Promise<Result<ICasualTransaction[]>> => {
        try {
            const transactions = await this.repository.getAll({memberId});
            return Result.success(transactions);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    getLastOneByMember = async (memberId: string): Promise<Result<ICasualTransaction>> => {
        try {
            const transaction = await this.repository.get({memberId});
            if (!transaction) throw new CasualTransactionNotFoundError()
            return Result.success(transaction);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    update = async (casualTransaction: ICasualTransaction): Promise<Result<ICasualTransaction>> => {
        try {
            const updatedCasualTransaction = await this.repository.update({id: casualTransaction.id}, casualTransaction);
            if (!updatedCasualTransaction) throw new CasualTransactionUpdateError()
            return Result.success(updatedCasualTransaction);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    delete = async (id: string): Promise<Result<ICasualTransaction>> => {
        try {
            const deletedTransaction = await this.repository.delete({id});
            if (!deletedTransaction) throw new CasualTransactionDeletionError()
            return Result.success(deletedTransaction);
        }
        catch (e) {
            return Result.failure(e);
        }
    }
}