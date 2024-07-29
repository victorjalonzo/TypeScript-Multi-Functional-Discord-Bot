import { ICreditInput } from "../domain/ICreditInput.js";
import { ICredit } from "../domain/ICredit.js";
import { Result } from "../../shared/domain/Result.js";
import { IRepository } from "../../shared/domain/IRepository.js";
import { IGuild } from "../../Guild/domain/IGuild.js";

export class CreditService implements ICreditInput {
    constructor(
        private readonly repository: IRepository<ICredit>,
        private readonly guildRepository: IRepository<IGuild>
    ){}

    async create(credit: ICredit): Promise<Result<ICredit>> {
        try {
            const createdCredit = await this.repository.create(credit);
            if (!createdCredit) throw new Error(`The credit record could not be created`)

            const guild = await this.guildRepository.get({ id: credit.guildId });
            if (!guild) throw new Error(`The associated guild record could not be found`)
            
            guild.credits.push(createdCredit)
            await this.guildRepository.update({ id: guild.id }, {credits: guild.credits})

            createdCredit.guild = guild

            return Result.success(createdCredit);
        }
        catch (e) {
            return Result.failure(String(e));
        }
    }

    async getAll(filters: Record<string, any>): Promise<Result<ICredit[]>> {
        try {
            const creditList = await this.repository.getAll(filters);
            return Result.success(creditList);
        }
        catch (e) {
            return Result.failure(String(e));
        }
    }

    async get(filters: Record<string, any>): Promise<Result<ICredit>> {
        try {
            const credit = await this.repository.get(filters);
            if (!credit) throw new Error(`No credit found`)
            
            return Result.success(credit);
        }
        catch (e) {
            return Result.failure(String(e));
        }
    }

    async delete(filters: Record<string, any>): Promise<Result<ICredit>> {
        try {
            const deletedCredit = await this.repository.delete(filters);
            if (!deletedCredit) throw new Error(`No credit deleted`)
            
            return Result.success(deletedCredit);
        }
        catch (e) {
            return Result.failure(String(e));
        }
    }
}