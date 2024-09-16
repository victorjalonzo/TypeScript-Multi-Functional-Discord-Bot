import { ICreditInput } from "../domain/ICreditInput.js";
import { ICredit } from "../domain/ICredit.js";
import { Result } from "../../shared/domain/Result.js";
import { IRepository } from "../../shared/domain/IRepository.js";
import { IGuild } from "../../Guild/domain/IGuild.js";

import {
    CreditCreationError,
    CreditNotFoundError,
    CreditUpdateError,
    CreditDeletionError
}
from "../domain/CreditExceptions.js";

export class CreditService implements ICreditInput {
    constructor(
        private readonly repository: IRepository<ICredit>,
        private readonly guildRepository: IRepository<IGuild>
    ){}

    async create(credit: ICredit): Promise<Result<ICredit>> {
        try {
            const createdCredit = await this.repository.create(credit);
            if (!createdCredit) throw new CreditCreationError()

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

    async getAll(guildId: string): Promise<Result<ICredit[]>> {
        try {
            const creditList = await this.repository.getAll({ guildId });
            return Result.success(creditList);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async get(id: string): Promise<Result<ICredit>> {
        try {
            const credit = await this.repository.get({id});
            if (!credit) throw new CreditNotFoundError()
            
            return Result.success(credit);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async delete(id: string): Promise<Result<ICredit>> {
        try {
            const deletedCredit = await this.repository.delete({id});
            if (!deletedCredit) throw new CreditDeletionError()
            
            return Result.success(deletedCredit);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async deleteAll(guildId: string): Promise<Result<ICredit[]>> {
        try {
            const deletedCredits = await this.repository.deleteAll({guildId});
            if (!deletedCredits) throw new CreditDeletionError()
            
            return Result.success(deletedCredits);
        }
        catch (e) {
            return Result.failure(e);
        }
    }
}