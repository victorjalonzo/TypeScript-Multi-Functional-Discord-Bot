import { IPaypoint } from "../domain/IPaypoint.js";
import { IRepository } from "../../shared/domain/IRepository.js";
import { IGuild } from "../../Guild/domain/IGuild.js";
import { ICredit } from "../../Credit/domain/ICredit.js";
import { ICasualPayment } from "../../CasualPayment/domain/ICasualPayment.js";
import { Result } from "../../shared/domain/Result.js";
import { IPaypointInput } from "../domain/IPaypointInput.js";

export class PaypointService implements IPaypointInput {
    constructor(
        private repository: IRepository<IPaypoint>,
        private guildRepository: IRepository<IGuild>,
        private creditRepository: IRepository<ICredit>,
        private casualPaymentRepository: IRepository<ICasualPayment>
    ) {}

    async create(paypoint: IPaypoint): Promise<Result<IPaypoint>> {
        try {
            const credits = await this.creditRepository.getAll({guildId: paypoint.guildId});
            const casualPayment = await this.casualPaymentRepository.getAll({guildId: paypoint.guildId});
    
            if (credits.length === 0) throw new Error("The guild must have at least one credit/role package")
            if (casualPayment.length === 0) throw new Error("The guild must have at least one casual/integrated payment method")
            
            const createdPaypoint = await this.repository.create(paypoint);
            if (!createdPaypoint) throw new Error("The paypoint could not be created")
    
            const guild = await this.guildRepository.get({id: paypoint.guildId});
            if (!guild) throw new Error("The guild could not be found")
    
            guild.paypoints.push(createdPaypoint);
            await this.guildRepository.update({id:  guild.id}, {paypoints: guild.paypoints});
    
            createdPaypoint.guild = guild;
            return Result.success(createdPaypoint);
        }
        catch(e) {
            return Result.failure(String(e));
        }
    }

    async get (id: string): Promise<Result<IPaypoint>> {
        try {
            const paypoint = await this.repository.get({id: id});
            if (!paypoint) throw new Error(`No paypoint found`)
            
            return Result.success(paypoint);
        }
        catch (e) {
            return Result.failure(String(e));
        }
    }

    async getAll(guildId: string): Promise<Result<IPaypoint[]>> {
        try {
            const paypoints = await this.repository.getAll({id: guildId});
            return Result.success(paypoints);
        }
        catch (e) {
            return Result.failure(String(e));
        }
    }

    async delete(id: string, guildId: string): Promise<Result<IPaypoint>> {
        try {
            const deletedPaypoint = await this.repository.delete({id: id, guildId: guildId});
            if (!deletedPaypoint) throw new Error(`No paypoint deleted`)
            
            return Result.success(deletedPaypoint);
        }
        catch(e) {
            return Result.failure(String(e));
        }
    }
}