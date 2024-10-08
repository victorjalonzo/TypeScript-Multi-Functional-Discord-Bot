import { IGuild } from "../../Guild/domain/IGuild.js";
import { ICasualPayment } from "../domain/ICasualPayment.js";
import { ICasualPaymentInput } from "../domain/ICasualPaymentInput.js";
import { IRepository } from "../../shared/domain/IRepository.js";
import { Result } from "../../shared/domain/Result.js";

import { 
    CasualPaymentCreationError,
    CasualPaymentNotFoundError,
    CasualPaymentUpdateError
} from "../domain/CasualPaymentExceptions.js";

export class CasualPaymentService implements ICasualPaymentInput {
    constructor (
        private repository: IRepository<ICasualPayment>,
        private guildRepository: IRepository<IGuild>
    ) {}
    
    create = async (casualPayment:ICasualPayment): Promise<Result<ICasualPayment>> => {
        try {
            const createdCasualPayment = await this.repository.create(casualPayment);
            if (!createdCasualPayment) throw new CasualPaymentCreationError()
            
            const guild = await this.guildRepository.get({ id: casualPayment.guild.id });
            if (!guild) throw new Error(`The guild record ${casualPayment.guild.name} (${casualPayment.guild.id}) could not be found.`)

            guild.casualPayments.push(createdCasualPayment);
            await this.guildRepository.update({ id: guild.id },  {casualPayments: guild.casualPayments });

            createdCasualPayment.guild = guild;
        
            return Result.success(createdCasualPayment);
        }
        catch(e) {
            return Result.failure(e);
        }
    }

    get = async (id: string, guildId: string): Promise<Result<ICasualPayment>> => {
        try {
            const casualPayment = await this.repository.get({id, guildId});
            if (!casualPayment) throw new CasualPaymentNotFoundError()
            
            return Result.success(casualPayment);
        }
        catch(e) {
            return Result.failure(e);
        }
    }

    getAll = async (guildId: string): Promise<Result<ICasualPayment[]>> => {
        try {
            const casualPaymentList = await this.repository.getAll({ guildId: guildId });
            return Result.success(casualPaymentList);
        }
        catch(e) {
            return Result.failure(e);
        }
    }

    delete = async ({name, guildId }: { name: string, guildId: string }): Promise<Result<Record<string, any>>> => {
        try {
            const casualPaymentDeleted = await this.repository.delete({ name, guildId });
            if (!casualPaymentDeleted) throw new CasualPaymentUpdateError()

            return Result.success(casualPaymentDeleted);
        }
        catch(e) {
            return Result.failure(e);
        }
    }

    deleteAll = async (guildId: string): Promise<Result<ICasualPayment[]>> => {
        try {
            const casualPaymentList = await this.repository.deleteAll({ guildId: guildId });
            return Result.success(casualPaymentList);
        }
        catch(e) {
            return Result.failure(e);
        }
    }
}