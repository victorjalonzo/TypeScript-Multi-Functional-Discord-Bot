import { IRepository } from "../../shared/domain/IRepository.js";
import { Result } from "../../shared/domain/Result.js";
import { CreditChannelLockerCreationError, CreditChannelLockerNotFoundError, CreditChannelLockerUpdateError } from "../domain/CreditChannelLockerExceptions.js";
import { ICreditChannelLocker } from "../domain/ICreditChannelLock.js";
import { ICreditChannelLockerInput } from "../domain/ICreditChannelLockerInput.js";

export class CreditChannelLockerService implements ICreditChannelLockerInput {
    constructor (private repository: IRepository<ICreditChannelLocker>) {}

    create = async (props: ICreditChannelLocker): Promise<Result<ICreditChannelLocker>> => {
        try {
            const createdCreditChannelLocker = await this.repository.create(props)
            if (!createdCreditChannelLocker) throw new CreditChannelLockerCreationError()
            return Result.success(createdCreditChannelLocker)
        }
        catch (e) {
            return Result.failure(e)
        }
    }

    update = async (props: ICreditChannelLocker): Promise<Result<ICreditChannelLocker>> => {
        try {
            const updatedCreditChannelLocker = await this.repository.update({id: props.id}, props)
            if (!updatedCreditChannelLocker) throw new CreditChannelLockerUpdateError()
            return Result.success(updatedCreditChannelLocker)
        }
        catch (e) {
            return Result.failure(e)
        }
    }

    get = async (id: string): Promise<Result<ICreditChannelLocker>> => {
        try {
            const creditChannelLocker = await this.repository.get({id})
            if (!creditChannelLocker) throw new CreditChannelLockerNotFoundError()
            return Result.success(creditChannelLocker)
        }
        catch (e) {
            return Result.failure(e)
        }
    }

    getAll = async (guildId: string): Promise<Result<ICreditChannelLocker[]>> => {
        try {
            const creditChannelLockers = await this.repository.getAll({guildId})
            return Result.success(creditChannelLockers)
        }
        catch (e) {
            return Result.failure(e)
        }
    }

    deleteAll = async (guildId: string): Promise<Result<ICreditChannelLocker[]>> => {
        try {
            const deletedCreditChannelLockers = await this.repository.deleteAll({guildId})
            return Result.success(deletedCreditChannelLockers)
        }
        catch (e) {
            return Result.failure(e)
        }
    }
}