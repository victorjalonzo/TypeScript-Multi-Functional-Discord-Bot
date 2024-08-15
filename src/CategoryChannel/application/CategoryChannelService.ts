import { ICategoryChannelInput } from "../domain/ICategoryChannelInput.js";
import { ICategoryChannel } from "../domain/ICategoryChannel.js";
import { Result } from "../../shared/domain/Result.js";
import { IRepository } from "../../shared/domain/IRepository.js";

import {
    CategoryChannelCreationError,
    CategoryChannelNotFoundError,
    CategoryChannelUpdateError,
    CategoryChannelDeletionError
}
from "../domain/CategoryChannelExceptions.js";

export class CategoryChannelService implements ICategoryChannelInput {
    constructor(private repository: IRepository<ICategoryChannel>) {}

    async create(categoryChannel: ICategoryChannel): Promise<Result<ICategoryChannel>> {
        try {
            const createdCategoryChannel = await this.repository.create(categoryChannel);
            if (!createdCategoryChannel) throw new CategoryChannelCreationError()
            return Result.success(createdCategoryChannel);
        }
        catch(e){
            return Result.failure(e);
        }
    }

    async get(id: string, guildId: string): Promise<Result<ICategoryChannel>> {
        try {
            const categoryChannel = await this.repository.get({id, guildId});
            if (!categoryChannel) throw new CategoryChannelNotFoundError()

            return Result.success(categoryChannel);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async getAll(guildId: string): Promise<Result<ICategoryChannel[]>> {
        try {
            const categoryChannels = await this.repository.getAll({guildId});
            return Result.success(categoryChannels);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async update(categoryChannel: ICategoryChannel): Promise<Result<ICategoryChannel>> {
        try {
            const updatedCategoryChannel = await this.repository.update({id: categoryChannel.id, guildId: categoryChannel.guildId}, categoryChannel);
            if (!updatedCategoryChannel) throw new CategoryChannelUpdateError()

            return Result.success(updatedCategoryChannel);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async delete(id: string, guildId: string): Promise<Result<ICategoryChannel>> {
        try {
            const deletedCategoryChannel = await this.repository.delete({id, guildId});
            if (!deletedCategoryChannel) throw new CategoryChannelDeletionError()

            return Result.success(deletedCategoryChannel);
        }
        catch (e) {
            return Result.failure(e);
        }
    }
}