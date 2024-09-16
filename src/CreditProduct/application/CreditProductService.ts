import { ICreditProductInput } from "../domain/ICreditProductInput.js";
import { ICreditProduct } from "../domain/ICreditProduct.js";
import { Result } from "../../shared/domain/Result.js";
import { IRepository } from "../../shared/domain/IRepository.js";
import { IGuild } from "../../Guild/domain/IGuild.js";

import {
    CreditProductCreationError,
    CreditProductNotFoundError,
    CreditProductDeletionError
}
from "../domain/CreditProductExceptions.js";

export class CreditProductService implements ICreditProductInput {
    constructor(
        private readonly repository: IRepository<ICreditProduct>,
        private readonly guildRepository: IRepository<IGuild>
    ){}

    async create(credit: ICreditProduct): Promise<Result<ICreditProduct>> {
        try {
            const createdCredit = await this.repository.create(credit);
            if (!createdCredit) throw new CreditProductCreationError()

            const guild = await this.guildRepository.get({ id: credit.guildId });
            if (!guild) throw new Error(`The associated guild record could not be found`)
            
            guild.credits.push(createdCredit)
            await this.guildRepository.update({ id: guild.id }, {credits: guild.credits})

            createdCredit.guild = guild

            return Result.success(createdCredit);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async getAll(guildId: string): Promise<Result<ICreditProduct[]>> {
        try {
            const creditList = await this.repository.getAll({ guildId });
            return Result.success(creditList);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async get(id: string): Promise<Result<ICreditProduct>> {
        try {
            const credit = await this.repository.get({id});
            if (!credit) throw new CreditProductNotFoundError()
            
            return Result.success(credit);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async delete(id: string): Promise<Result<ICreditProduct>> {
        try {
            const deletedCredit = await this.repository.delete({id});
            if (!deletedCredit) throw new CreditProductDeletionError()
            
            return Result.success(deletedCredit);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async deleteAll(guildId: string): Promise<Result<ICreditProduct[]>> {
        try {
            const deletedCredits = await this.repository.deleteAll({guildId});
            if (!deletedCredits) throw new CreditProductDeletionError()
            
            return Result.success(deletedCredits);
        }
        catch (e) {
            return Result.failure(e);
        }
    }
}