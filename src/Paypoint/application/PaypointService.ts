import { IPaypoint } from "../domain/IPaypoint.js";
import { IRepository } from "../../shared/domain/IRepository.js";
import { IGuild } from "../../Guild/domain/IGuild.js";
import { ICreditProduct } from "../../CreditProduct/domain/ICreditProduct.js";
import { ICasualPayment } from "../../CasualPayment/domain/ICasualPayment.js";
import { Result } from "../../shared/domain/Result.js";
import { IPaypointInput } from "../domain/IPaypointInput.js";

import {
    PaypointCreationError,
    PaypointNotFoundError,
    PaypointDeletionError
}
from "../domain/PaypointExceptions.js";

export class PaypointService implements IPaypointInput {
    constructor(
        private repository: IRepository<IPaypoint>,
        private guildRepository: IRepository<IGuild>,
    ) {}

    async create(paypoint: IPaypoint): Promise<Result<IPaypoint>> {
        try {
            const createdPaypoint = await this.repository.create(paypoint);
            if (!createdPaypoint) throw new PaypointCreationError()
    
            const guild = await this.guildRepository.get({id: paypoint.guildId});
            if (!guild) throw new Error("The guild could not be found")
    
            guild.paypoints.push(createdPaypoint);
            await this.guildRepository.update({id:  guild.id}, {paypoints: guild.paypoints});
    
            createdPaypoint.guild = guild;
            return Result.success(createdPaypoint);
        }
        catch(e) {
            return Result.failure(e);
        }
    }

    async update(paypoint: IPaypoint): Promise<Result<IPaypoint>> {
        try {
            const updatedPaypoint = await this.repository.update({guildId: paypoint.guildId}, paypoint);
            if (!updatedPaypoint) throw new PaypointCreationError()
            
            return Result.success(updatedPaypoint);
        }
        catch(e) {
            return Result.failure(e);
        }
    }

    async getByMessageID(messageID: string): Promise<Result<IPaypoint>> {
        try {
            const paypoint = await this.repository.get({messageId: messageID});
            if (!paypoint) throw new PaypointNotFoundError()
            return Result.success(paypoint);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async get (guildId: string): Promise<Result<IPaypoint>> {
        try {
            const paypoint = await this.repository.get({ guildId });
            if (!paypoint) throw new PaypointNotFoundError()
            
            return Result.success(paypoint);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async getAll(): Promise<Result<IPaypoint[]>> {
        try {
            const paypoints = await this.repository.getAll({});
            return Result.success(paypoints);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async delete(guildId: string): Promise<Result<IPaypoint>> {
        try {
            const deletedPaypoint = await this.repository.delete({guildId: guildId});
            if (!deletedPaypoint) throw new PaypointDeletionError()
            
            return Result.success(deletedPaypoint);
        }
        catch(e) {
            return Result.failure(e);
        }
    }
}