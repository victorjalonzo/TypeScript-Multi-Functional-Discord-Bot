import { IVoiceChannelInput } from "../domain/IVoiceChannelInput.js";
import { IVoiceChannel } from "../domain/IVoiceChannel.js";
import { IRepository } from "../../shared/domain/IRepository.js";
import { Result } from "../../shared/domain/Result.js";

import {
    VoiceChannelCreationError,
    VoiceChannelNotFoundError,
    VoiceChannelUpdateError,
    VoiceChannelDeletionError
} from "../domain/VoiceChannelExceptions.js";

export class VoiceChannelService implements IVoiceChannelInput {
    constructor (private repository: IRepository<IVoiceChannel>) {}

    async create(voiceChannel: IVoiceChannel): Promise<Result<IVoiceChannel>> {
        try {
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