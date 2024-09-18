import { IRepository } from "../../shared/domain/IRepository.js";
import { Result } from "../../shared/domain/Result.js";
import { CreditRewardCreationError, CreditRewardDeleteError, CreditRewardNotFoundError } from "../domain/CreditRewardExceptions.js";
import { ICreditReward } from "../domain/ICreditReward.js";
import { ICreditRewardInput } from "../domain/ICreditRewardInput.js";

export class CreditRewardService implements ICreditRewardInput{
    constructor (private repository: IRepository<ICreditReward>){}

    create = async (creditReward: ICreditReward): Promise<Result<ICreditReward>> => {
        try {
            const createdCreditReward = await this.repository.create(creditReward)
            if (!createdCreditReward) throw new CreditRewardCreationError()
            return Result.success(createdCreditReward)
        }
        catch (e) {
            return Result.failure(e)
        }
    }

    get = async (id: string): Promise<Result<ICreditReward>> => {
        try {
            const creditReward = await this.repository.get({id})
            if (!creditReward) throw new CreditRewardNotFoundError()
            return Result.success(creditReward)
        }
        catch (e) {
            return Result.failure(e)
        }
    }

    getAll = async (guildId: string): Promise<Result<ICreditReward[]>> => {
        try {
            const creditRewards = await this.repository.getAll({guildId})
            return Result.success(creditRewards)
        }
        catch (e) {
            return Result.failure(e)
        }
    }

    delete = async (id: string): Promise<Result<ICreditReward>> => {
        try {
            const deletedCreditReward = await this.repository.delete({id})
            if (!deletedCreditReward) throw new CreditRewardDeleteError()
            return Result.success(deletedCreditReward)
        }
        catch (e) {
            return Result.failure(e)
        }
    }

    deleteAll = async (guildId: string): Promise<Result<ICreditReward[]>> => {
        try {
            const deletedCreditRewards = await this.repository.deleteAll({guildId})
            return Result.success(deletedCreditRewards)
        }
        catch (e) {
            return Result.failure(e)
        }
    }

}