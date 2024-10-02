import { IRepository } from "../../shared/domain/IRepository.js";
import { Result } from "../../shared/domain/Result.js";
import { CreditWalletAlreadyExistsError, CreditWalletCreationError, CreditWalletInsufficientCreditsError, CreditWalletNotFoundError, CreditWalletUpdateError } from "../domain/CreditWalletExceptions.js";
import { ICreditWallet } from "../domain/ICreditWallet.js";
import { ICreditWalletInput } from "../domain/ICreditWalletInput.js";

export class CreditWalletService implements ICreditWalletInput{
    constructor (private repository: IRepository<ICreditWallet>) {}

    async create (creditWallet: ICreditWallet): Promise<Result<ICreditWallet>> {
        try {
            const existingWallet = await this.repository.get({memberId: creditWallet.memberId, guildId: creditWallet.guildId})
            if (existingWallet) throw new CreditWalletAlreadyExistsError(creditWallet)

            const creditWalletCreated = await this.repository.create(creditWallet)
            if (!creditWalletCreated) throw new CreditWalletCreationError()

            return Result.success(creditWalletCreated)
        }
        catch (error) {
            return Result.failure(error)
        }
    }

    async get (memberId: string, guildId: string): Promise<Result<ICreditWallet>> {
        try {
            const creditWallet = await this.repository.get({memberId, guildId}, ['member', 'guild'])
            if (!creditWallet) throw new CreditWalletNotFoundError()
            return Result.success(creditWallet)
        }
        catch (error) {
            return Result.failure(error)
        }
    }

    async getAll (guildId: string): Promise<Result<ICreditWallet[]>> {
        try {
            const creditWallets = await this.repository.getAll({guildId}, ['member', 'guild'])
            return Result.success(creditWallets)
        }
        catch (error) {
            return Result.failure(error)
        }
    }

    async update (creditWallet: ICreditWallet): Promise<Result<ICreditWallet>> {
        try {
            const filters = {memberId: creditWallet.memberId, guildId: creditWallet.guildId}
            const creditWalletUpdated = await this.repository.update(filters, creditWallet)
            if (!creditWalletUpdated) throw new CreditWalletUpdateError()
            return Result.success(creditWalletUpdated)
        }
        catch (error) {
            return Result.failure(error)
        }
    }

    async deleteAll (guildId: string): Promise<Result<ICreditWallet[]>> {
        try {
            const creditWallets = await this.repository.deleteAll({guildId})
            return Result.success(creditWallets)
        }
        catch (error) {
            return Result.failure(error)
        }
    }

    async increment(memberId: string, guildId: string, credits: number): Promise<Result<number>> {
        try {
            const creditWallet = await this.repository.get({memberId, guildId})
            if (!creditWallet) throw new CreditWalletNotFoundError()

            creditWallet.credits += credits

            const creditWalletUpdated = await this.repository.update({memberId, guildId}, creditWallet)
            if (!creditWalletUpdated) throw new CreditWalletUpdateError()

            return Result.success(creditWalletUpdated.credits)
        }
        catch (error) {
            return Result.failure(error)
        }
    }

    async decrement (memberId: string, guildId: string, credits: number): Promise<Result<number>> {
        try {
            const creditWallet = await this.repository.get({memberId, guildId})
            if (!creditWallet) throw new CreditWalletNotFoundError()

            if (creditWallet.credits < credits) throw new CreditWalletInsufficientCreditsError({
                availableCredits: creditWallet.credits,
                requiredCredits: credits
            })

            creditWallet.credits -= credits

            const creditWalletUpdated = await this.repository.update({memberId, guildId}, creditWallet)
            if (!creditWalletUpdated) throw new CreditWalletUpdateError()

            return Result.success(creditWalletUpdated.credits)
        }
        catch (error) {
            return Result.failure(error)
        }
    }
}