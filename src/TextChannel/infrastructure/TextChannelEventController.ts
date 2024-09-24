import { ITextChannelInput } from "../domain/ITextChannelInput.js";
import { TextChannel as DiscordTextChannel, Guild as DiscordGuild, ChannelType } from "discord.js";
import { TextChannelTransformer } from "./TextChannelTransformer.js";
import { logger } from "../../shared/utils/logger.js";
import { GuildTransformer } from "../../Guild/infrastructure/GuildTransformer.js";
import { CategoryChannelTransformer } from "../../CategoryChannel/infrastructure/CategoryChannelTransformer.js";
import { IGuildInput } from "../../Guild/domain/IGuildInput.js";
import { IGuild } from "../../Guild/domain/IGuild.js";
import { ITextChannel } from "../domain/ITextChannel.js";
import { Result } from "../../shared/domain/Result.js";
import { ICategoryChannelInput } from "../../CategoryChannel/domain/ICategoryChannelInput.js";
import { ICategoryChannel } from "../../CategoryChannel/domain/ICategoryChannel.js";
import { GuildHasNoTextChannels } from "../../Guild/domain/GuildExceptions.js";
import { refreshLog } from "../../shared/utils/RefreshLog.js";

export class TextChannelEventController {
    constructor (
        private service: ITextChannelInput,
        private guildService: IGuildInput,
        private categoryChannelService: ICategoryChannelInput
    ) {}

    refresh = async (guild: DiscordGuild): Promise<void> => {
        const channelsCreated: ITextChannel[] = [];
        const channelsUpdated: ITextChannel[] = [];
        const channelsDeleted: ITextChannel[] = [];

        try {

            const [guildCachedResult, channelsCachedResult] = await Promise.all([
                this.guildService.get(guild.id),
                this.service.getAll(guild.id)
            ]);

            if (!guildCachedResult.isSuccess() || !channelsCachedResult.isSuccess()) {
                throw guildCachedResult.error || channelsCachedResult.error;
            }

            const guildCached = guildCachedResult.value as IGuild;
            const channelsCached = channelsCachedResult.value as ITextChannel[];

            let channels: DiscordTextChannel[];

            try {
                channels = (await guild.channels.fetch())
                    .filter(channel => channel !== null && channel.type === ChannelType.GuildText)
                    .map(channel => channel as DiscordTextChannel);
            } catch (e) {
                throw new Error(`Error fetching text channels: ${String(e)}`);
            }

            if (channels.length === 0) throw new GuildHasNoTextChannels();

            const channelsRefreshed: ITextChannel[] = [];

            for (const channel of channels) {
                const match = channelsCached.find(c => c.id === channel.id);

                let categoryChannelCached: ICategoryChannel | undefined;

                if (channel.parentId !== null) {
                    const categoryChannelResult = await this.categoryChannelService.get(channel.parentId, guild.id);
                    if (!categoryChannelResult.isSuccess()) categoryChannelCached = categoryChannelResult.value;
                }

                const channelParsed: ITextChannel = TextChannelTransformer.parse({
                    discordTextChannel: channel,
                    parent: categoryChannelCached ?? null,
                    guild: guildCached
                });

                let result: Result<ITextChannel>;

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
            if (!(e instanceof GuildHasNoTextChannels)) {
                logger.info(String(e))
                return;
            }
        }
        refreshLog({ 
            itemsAdded: channelsCreated.length, 
            itemsUpdated: channelsUpdated.length, 
            itemsRemoved: channelsDeleted.length, 
            singular: "textchannel", 
            plural: "textchannels"
        });
    }

    createRecord = async (textChannel: DiscordTextChannel): Promise<void> => {
        try {
            const guildCachedResult = await this.guildService.get(textChannel.guildId);
            if (!guildCachedResult.isSuccess()) throw guildCachedResult.error

            const guildCached = guildCachedResult.value as IGuild

            const guild = GuildTransformer.parse(textChannel.guild)
            const parent = textChannel.parent 
                ? CategoryChannelTransformer.parse(textChannel.parent, guildCached) 
                : null

            const textChannelParsed = TextChannelTransformer.parse({discordTextChannel: textChannel, parent, guild});
            
            const result = await this.service.create(textChannelParsed);
            if (!result.isSuccess()) throw result.error
    
            const textChannelCreated = result.value
    
            logger.info(`Text channel ${textChannelCreated.name} (${textChannelCreated.id}) was created`)
        }
        catch (e) {
            logger.warn(e)
        }
    }

    updateRecord = async (oldTextChannel: DiscordTextChannel, newTextChannel: DiscordTextChannel): Promise<void> => {
        try {
            const guildCachedResult = await this.guildService.get(newTextChannel.guildId);
            if (!guildCachedResult.isSuccess()) throw guildCachedResult.error

            const guildCached = guildCachedResult.value as IGuild

            const guild = GuildTransformer.parse(newTextChannel.guild)
            const parent = newTextChannel.parent 
                ? CategoryChannelTransformer.parse(newTextChannel.parent, guildCached) 
                : null

            const textChannelParsed = TextChannelTransformer.parse({discordTextChannel: newTextChannel,parent, guild});
            
            const result = await this.service.update(textChannelParsed);
            if (!result.isSuccess()) throw result.error

            const textChannelUpdated = result.value
            logger.info(`Text channel ${textChannelUpdated.name} (${textChannelUpdated.id}) was updated`)
        }
        catch (e) {
            logger.warn(e)
        }
    }

    deleteRecord = async (textChannel: DiscordTextChannel): Promise<void> => {
        try {
            const guild = GuildTransformer.parse(textChannel.guild)

            const result = await this.service.delete(textChannel.id, guild.id);
            if (!result.isSuccess()) throw result.error
    
            const textChannelDeleted = result.value
            logger.info(`Text channel ${textChannelDeleted.name} (${textChannelDeleted.id}) was deleted`)
        }
        catch (e) {
            logger.warn(e)
        }
    }
}