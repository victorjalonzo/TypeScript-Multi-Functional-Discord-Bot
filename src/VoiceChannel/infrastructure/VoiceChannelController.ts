import { IVoiceChannelInput } from "../domain/IVoiceChannelInput.js";
import { logger } from "../../shared/utils/logger.js";
import { VoiceChannel as DiscordVoiceChannel } from "discord.js";
import { VoiceChannelTransformer } from "./VoiceChannelTransformer.js";

export class VoiceChannelEventController {
    constructor(private service: IVoiceChannelInput) {}

    createRecord = async (voiceChannel: DiscordVoiceChannel): Promise<void> => {
        try {
            const voiceChannelParsed = VoiceChannelTransformer.parse(voiceChannel);
            const result = await this.service.create(voiceChannelParsed);

            if (!result.isSuccess()) throw result.error

            const voiceChannelCreated = result.value
            logger.info(`The voice channel ${voiceChannelCreated.name} (${voiceChannelCreated.id}) was created`)
        }
        catch (e) {
            logger.warn(e)
        }
    }

    updateRecord = async (oldVoiceChannel: DiscordVoiceChannel, newVoiceChannel: DiscordVoiceChannel): Promise<void> => {
        try {
            const oldVoiceChannelParsed = VoiceChannelTransformer.parse(oldVoiceChannel);
            const newVoiceChannelParsed = VoiceChannelTransformer.parse(newVoiceChannel);
            const result = await this.service.update(newVoiceChannelParsed);

            if (!result.isSuccess()) throw result.error

            const voiceChannelUpdated = result.value
            logger.info(`The voice channel ${voiceChannelUpdated.name} (${voiceChannelUpdated.id}) was updated`)
        }
        catch (e) {
            logger.warn(e)
        }
    }

    deleteRecord = async (voiceChannel: DiscordVoiceChannel): Promise<void> => {
        try {
            const voiceChannelParsed = VoiceChannelTransformer.parse(voiceChannel);
            const result = await this.service.delete(voiceChannelParsed.id, voiceChannelParsed.guildId);

            if (!result.isSuccess()) throw result.error

            const voiceChannelDeleted = result.value
            logger.info(`The voice channel ${voiceChannelDeleted.name} (${voiceChannelDeleted.id}) was deleted`)
        }
        catch (e) {
            logger.warn(e)
        }
    }
}