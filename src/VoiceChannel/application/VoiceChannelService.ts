import { IVoiceChannelInput } from "../domain/IVoiceChannelInput.js";
import { IVoiceChannel } from "../domain/IVoiceChannel.js";
import { IRepository } from "../../shared/domain/IRepository.js";
import { Result } from "../../shared/domain/Result.js";
import { ITextChannel } from "../../TextChannel/domain/ITextChannel.js";
import { IGuild } from "../../Guild/domain/IGuild.js";
import { IGuildInput } from "../../Guild/domain/IGuildInput.js";
import { ICategoryChannelInput } from "../../CategoryChannel/domain/ICategoryChannelInput.js";
import { ICategoryChannel } from "../../CategoryChannel/domain/ICategoryChannel.js";

import {
    VoiceChannelCreationError,
    VoiceChannelNotFoundError,
    VoiceChannelUpdateError,
    VoiceChannelDeletionError
} from "../domain/VoiceChannelExceptions.js";


export class VoiceChannelService implements IVoiceChannelInput {
    constructor (
        private repository: IRepository<IVoiceChannel>,
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

    async create(voiceChannel: IVoiceChannel): Promise<Result<IVoiceChannel>> {
        try {
            const guild = await this._getGuild(voiceChannel);
            const parent = await this._getParent(voiceChannel);

            voiceChannel.guild = guild
            voiceChannel.parent = parent ?? null

            const createdVoiceChannel = await this.repository.create(voiceChannel);
            if (!createdVoiceChannel) throw new VoiceChannelCreationError()
            return Result.success(createdVoiceChannel);
        }
        catch(e){
            return Result.failure(e);
        }
    }

    async get(id: string, guildId: string): Promise<Result<IVoiceChannel>> {
        try {
            const voiceChannel = await this.repository.get({id, guildId});
            if (!voiceChannel) throw new VoiceChannelNotFoundError()

            return Result.success(voiceChannel);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async getAll(guildId: string): Promise<Result<IVoiceChannel[]>> {
        try {
            const voiceChannels = await this.repository.getAll({guildId});
            return Result.success(voiceChannels);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async update(voiceChannel: IVoiceChannel): Promise<Result<IVoiceChannel>> {
        try {
            const guild = await this._getGuild(voiceChannel);
            const parent = await this._getParent(voiceChannel);

            voiceChannel.guild = guild
            voiceChannel.parent = parent ?? null

            const updatedVoiceChannel = await this.repository.update({id: voiceChannel.id, guildId: voiceChannel.guildId}, voiceChannel);
            if (!updatedVoiceChannel) throw new VoiceChannelUpdateError()

            return Result.success(updatedVoiceChannel);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async delete(id: string, guildId: string): Promise<Result<IVoiceChannel>> {
        try {
            const deletedVoiceChannel = await this.repository.delete({id, guildId});
            if (!deletedVoiceChannel) throw new VoiceChannelDeletionError()

            return Result.success(deletedVoiceChannel);
        }
        catch (e) {
            return Result.failure(e);
        }
    }
}