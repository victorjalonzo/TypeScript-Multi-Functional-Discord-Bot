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
            return await this.repository.getAll({guildId})
            .then(r => Result.success(r))
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    getAllByMemberOnGuild = async (memberId: string, guildId: string): Promise<Result<ICasualTransaction[]>> => {
        try {
            return await this.repository.getAll({memberId, guildId})
            .then(r => Result.success(r))
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    getAllByMember = async (memberId: string): Promise<Result<ICasualTransaction[]>> => {
        try {
            return await this.repository.getAll({memberId})
            .then(r => Result.success(r))
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    getLastOneByMember = async (memberId: string): Promise<Result<ICasualTransaction>> => {
        try {
            return await this.repository.get({memberId})
            .then(r => r ? Result.success(r) : Promise.reject(new CasualTransactionNotFoundError()))
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    update = async (casualTransaction: ICasualTransaction): Promise<Result<ICasualTransaction>> => {
        try {
            return await this.repository.update({id: casualTransaction.id}, casualTransaction)
            .then(r => r ? Result.success(r) : Promise.reject(new CasualTransactionNotFoundError()))
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    delete = async (id: string): Promise<Result<ICasualTransaction>> => {
        try {
            return await this.repository.delete({id})
            .then(r => r ? Result.success(r) : Promise.reject(new CasualTransactionNotFoundError()))
        }
        catch (e) {
            return Result.failure(e);
        }
    }
}