import { IVoiceChannelInput } from "../domain/IVoiceChannelInput.js";
import { logger } from "../../shared/utils/logger.js";
import { VoiceChannel as DiscordVoiceChannel, Guild as DiscordGuild, ChannelType } from "discord.js";
import { VoiceChannelTransformer } from "./VoiceChannelTransformer.js";
import { GuildTransformer } from "../../Guild/infrastructure/GuildTransformer.js";
import { CategoryChannelTransformer } from "../../CategoryChannel/infrastructure/CategoryChannelTransformer.js";
import { IGuildInput } from "../../Guild/domain/IGuildInput.js";
import { IGuild } from "../../Guild/domain/IGuild.js";
import { IVoiceChannel } from "../domain/IVoiceChannel.js";
import { ICategoryChannel } from "../../CategoryChannel/domain/ICategoryChannel.js";
import { ICategoryChannelInput } from "../../CategoryChannel/domain/ICategoryChannelInput.js";
import { Result } from "../../shared/domain/Result.js";
import { GuildHasNoVoiceChannels } from "../../Guild/domain/GuildExceptions.js";
import { refreshLog } from "../../shared/utils/RefreshLog.js";

export class VoiceChannelEventController {
    constructor(
        private service: IVoiceChannelInput,
        private guildService: IGuildInput,
        private categoryChannelService: ICategoryChannelInput
    ) {}

    refresh = async (guild: DiscordGuild): Promise<void> => {
        const channelsCreated: IVoiceChannel[] = [];
        const channelsUpdated: IVoiceChannel[] = [];
        const channelsDeleted: IVoiceChannel[] = [];

        try {

            const [guildCachedResult, channelsCachedResult] = await Promise.all([
                this.guildService.get(guild.id),
                this.service.getAll(guild.id)
            ]);

            if (!guildCachedResult.isSuccess() || !channelsCachedResult.isSuccess()) {
                throw guildCachedResult.error || channelsCachedResult.error;
            }

            const guildCached = guildCachedResult.value as IGuild;
            const channelsCached = channelsCachedResult.value as IVoiceChannel[];

            let channels: DiscordVoiceChannel[];

            try {
                channels = (await guild.channels.fetch())
                    .filter(channel => channel !== null && channel.type === ChannelType.GuildVoice)
                    .map(channel => channel as DiscordVoiceChannel);
            } catch (e) {
                throw new Error(`Error fetching voice channels: ${String(e)}`);
            }

            if (channels.length === 0) throw new GuildHasNoVoiceChannels();

            const channelsRefreshed: IVoiceChannel[] = [];

            for (const channel of channels) {
                const match = channelsCached.find(c => c.id === channel.id);

                let categoryChannelCached: ICategoryChannel | undefined;

                if (channel.parentId !== null) {
                    const categoryChannelResult = await this.categoryChannelService.get(channel.parentId, guild.id);
                    if (categoryChannelResult.isSuccess()) {
                        categoryChannelCached = categoryChannelResult.value;
                    }
                }

                const channelParsed: IVoiceChannel = VoiceChannelTransformer.parse({
                    discordVoiceChannel: channel,
                    parent: categoryChannelCached ?? null,
                    guild: guildCached
                });

                let result: Result<IVoiceChannel>;

                if (match) {
                    result = await this.service.update(channelParsed);
                    if (!result.isSuccess()) throw result.error;

                    channelsUpdated.push(result.value);
                } else {
                    result = await this.service.create(channelParsed);
                    if (!result.isSuccess()) throw result.error;

                    channelsCreated.push(result.value);
                }

                channelsRefreshed.push(result.value);
            }

            const channelObsoletes = channelsCached.filter(channelCached => {
                return !channelsRefreshed.some(channelRefreshed => channelRefreshed.id === channelCached.id);
            });

            for (const channelObsolete of channelObsoletes) {
                const result = await this.service.delete(channelObsolete.id, guild.id);
                if (!result.isSuccess()) throw result.error;

                channelsDeleted.push(channelObsolete);
            }
        }
        catch (e) {
            if (!(e instanceof GuildHasNoVoiceChannels)) {
                logger.warn(String(e))
            }
        }
        refreshLog({
            itemsAdded: channelsCreated.length,
            itemsUpdated: channelsUpdated.length, 
            itemsRemoved: channelsDeleted.length, 
            singular: "voicechannel", 
            plural: "voicechannels"
        });
    }

    createRecord = async (voiceChannel: DiscordVoiceChannel): Promise<void> => {
        try {
            const guildCachedResult = await this.guildService.get(voiceChannel.guildId);
            if (!guildCachedResult.isSuccess()) throw guildCachedResult.error

            const guildCached = guildCachedResult.value as IGuild

            const guild = GuildTransformer.parse(voiceChannel.guild)
            const parent = voiceChannel.parent 
                ? CategoryChannelTransformer.parse(voiceChannel.parent, guildCached) 
                : null

            const voiceChannelParsed = VoiceChannelTransformer.parse({discordVoiceChannel:voiceChannel, parent, guild});
            const result = await this.service.create(voiceChannelParsed);

            if (!result.isSuccess()) throw result.error

            const voiceChannelCreated = result.value
            logger.info(`Voice channel ${voiceChannelCreated.name} (${voiceChannelCreated.id}) was created`)
        }
        catch (e) {
            logger.warn(e)
        }
    }

    updateRecord = async (oldVoiceChannel: DiscordVoiceChannel, newVoiceChannel: DiscordVoiceChannel): Promise<void> => {
        try {
            const guildCachedResult = await this.guildService.get(newVoiceChannel.guildId);
            if (!guildCachedResult.isSuccess()) throw guildCachedResult.error

            const guildCached = guildCachedResult.value as IGuild

            const guild = GuildTransformer.parse(newVoiceChannel.guild)
            const parent = newVoiceChannel.parent 
                ? CategoryChannelTransformer.parse(newVoiceChannel.parent,  guildCached) 
                : null

            const voiceChannelParsed = VoiceChannelTransformer.parse({discordVoiceChannel:newVoiceChannel, parent, guild});
            const result = await this.service.update(voiceChannelParsed);

            if (!result.isSuccess()) throw result.error

            const voiceChannelUpdated = result.value
            logger.info(`Voice channel ${voiceChannelUpdated.name} (${voiceChannelUpdated.id}) was updated`)
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
            logger.info(`Voice channel ${voiceChannelDeleted.name} (${voiceChannelDeleted.id}) was deleted`)
        }
        catch (e) {
            logger.warn(e)
        }
    }
}