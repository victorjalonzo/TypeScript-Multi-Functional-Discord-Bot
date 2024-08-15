import {ITextChannel} from "../domain/ITextChannel.js";
import {IRepository} from "../../shared/domain/IRepository.js";
import { Result } from "../../shared/domain/Result.js";
import { ITextChannelInput } from "../domain/ITextChannelInput.js";

import { 
    TextChannelCreationError,
    TextChannelNotFoundError,
    TextChannelUpdateError,
    TextChannelDeletionError,
} from "../domain/TextChannelExceptions.js";

export class TextChannelService implements ITextChannelInput {
    constructor (private repository: IRepository<ITextChannel>) {}

    async create(textChannel: ITextChannel): Promise<Result<ITextChannel>> {
        try {
            const textChannelCreated =  await this.repository.create(textChannel);
            if (!textChannelCreated) throw new TextChannelCreationError()

            return Result.success(textChannelCreated);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async get(id: string, guildId: string): Promise<Result<ITextChannel>> {
        try {
            const textChannel = await this.repository.get({id, guildId});
            if (!textChannel) throw new TextChannelNotFoundError()

            return Result.success(textChannel);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async getAll(guildId: string): Promise<Result<ITextChannel[]>> {
        try {
            const textChannels = await this.repository.getAll({guildId});
            return Result.success(textChannels);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async update(textChannel: ITextChannel): Promise<Result<ITextChannel>> {
        try {
            const filters = { id: textChannel.id, guildId: textChannel.guildId };
            const textChannelUpdated = await this.repository.update(filters, textChannel);
            if (!textChannelUpdated) throw new TextChannelUpdateError()

            return Result.success(textChannelUpdated);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async delete(id: string, guildId: string): Promise<Result<ITextChannel>> {
        try {
            const textChannel = await this.repository.delete({id, guildId});
            if (!textChannel) throw new TextChannelDeletionError()

            return Result.success(textChannel);
        }
        catch (e) {
            return Result.failure(e);
        }
    }
}