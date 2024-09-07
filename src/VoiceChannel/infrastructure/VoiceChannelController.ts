import { IVoiceChannelInput } from "../domain/IVoiceChannelInput.js";
import { logger } from "../../shared/utils/logger.js";
import { VoiceChannel as DiscordVoiceChannel } from "discord.js";
import { VoiceChannelTransformer } from "./VoiceChannelTransformer.js";
import { GuildTransformer } from "../../Guild/infrastructure/GuildTransformer.js";
import { CategoryChannelTransformer } from "../../CategoryChannel/infrastructure/CategoryChannelTransformer.js";

export class VoiceChannelEventController {
    constructor(private service: IVoiceChannelInput) {}

    createRecord = async (voiceChannel: DiscordVoiceChannel): Promise<void> => {
        try {
            const guild = GuildTransformer.parse(voiceChannel.guild)
            const parent = voiceChannel.parent ? CategoryChannelTransformer.parse(voiceChannel.parent) : null

            const voiceChannelParsed = VoiceChannelTransformer.parse({discordVoiceChannel:voiceChannel, parent, guild});
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
            const guild = GuildTransformer.parse(newVoiceChannel.guild)
            const parent = newVoiceChannel.parent ? CategoryChannelTransformer.parse(newVoiceChannel.parent) : null

            const voiceChannelParsed = VoiceChannelTransformer.parse({discordVoiceChannel:newVoiceChannel, parent, guild});
            const result = await this.service.update(voiceChannelParsed);

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
            const result = await this.service.delete(voiceChannel.id, voiceChannel.guildId);
            if (!result.isSuccess()) throw result.error

            const voiceChannelDeleted = result.value
            logger.info(`The voice channel ${voiceChannelDeleted.name} (${voiceChannelDeleted.id}) was deleted`)
        }
        catch (e) {
            logger.warn(e)
        }
    }
}