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
import { IGuild } from "../../Guild/domain/IGuild.js";
import { IGuildInput } from "../../Guild/domain/IGuildInput.js";
import { ICategoryChannelInput } from "../../CategoryChannel/domain/ICategoryChannelInput.js";
import { ICategoryChannel } from "../../CategoryChannel/domain/ICategoryChannel.js";

export class TextChannelService implements ITextChannelInput {
    constructor (
        private repository: IRepository<ITextChannel>,
        private guildService: IGuildInput,
        private categoryChannelService: ICategoryChannelInput
    ) {}

    async _getGuild (textChannel: ITextChannel): Promise<IGuild> {
        const guildResult = await this.guildService.get(textChannel.guildId);
        if (!guildResult.isSuccess()) throw guildResult.error

        return guildResult.value
    }

    _getParent = async (textChannel: ITextChannel): Promise<ICategoryChannel | undefined> => {
        if (!textChannel.parentId) return
        
        const categoryChannelResult = await this.categoryChannelService.get(textChannel.parentId, textChannel.guildId);
        if (!categoryChannelResult.isSuccess()) return

        return categoryChannelResult.value
    }

    async create(textChannel: ITextChannel): Promise<Result<ITextChannel>> {
        try {
            const guild = await this._getGuild(textChannel);
            const parent = await this._getParent(textChannel);

            textChannel.guild = guild
            textChannel.parent = parent ?? null

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
            const guild = await this._getGuild(textChannel);
            const parent = await this._getParent(textChannel);

            textChannel.guild = guild
            textChannel.parent = parent ?? null

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