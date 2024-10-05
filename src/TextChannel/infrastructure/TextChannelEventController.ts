import { ITextChannelInput } from "../domain/ITextChannelInput.js";
import { TextChannel as DiscordTextChannel, Guild as DiscordGuild, ChannelType, NonThreadGuildBasedChannel } from "discord.js";
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

    refresh = async (guild: DiscordGuild, channels: (NonThreadGuildBasedChannel | null)[]): Promise<void> => {
        const channelsCreated: ITextChannel[] = [];
        const channelsUpdated: ITextChannel[] = [];
        const channelsDeleted: ITextChannel[] = [];

        try {
            const textChannels: DiscordTextChannel[] = channels
                .filter(channel => channel !== null && channel.type === ChannelType.GuildText)
                .map(channel => channel as DiscordTextChannel);

            if (textChannels.length === 0) throw new GuildHasNoTextChannels();

            const [guildRecordResult, textChannelRecordsResult] = await Promise.all([
                this.guildService.get(guild.id),
                this.service.getAll(guild.id)
            ]);

            if (!guildRecordResult.isSuccess() || !textChannelRecordsResult.isSuccess()) {
                throw guildRecordResult.error || textChannelRecordsResult.error;
            }

            const guildRecord: IGuild = guildRecordResult.value;
            const textChannelRecords: ITextChannel[] = textChannelRecordsResult.value;

            const textChannelsRefreshed: ITextChannel[] = [];

            for (const channel of textChannels) {
                const match = textChannelRecords.find(c => c.id === channel.id);

                const categoryChannelRecord: ICategoryChannel | undefined = channel.parentId
                    ? await this.categoryChannelService.get(channel.parentId, guild.id)
                        .then(r => r.isSuccess() ? r.value : undefined)
                    : undefined;

                const textChannelParsed: ITextChannel = TextChannelTransformer.parse({
                    discordTextChannel: channel,
                    parent: categoryChannelRecord ?? null,
                    guild: guildRecord
                });

                let result: Result<ITextChannel>;

                if (match) {
                    result = await this.service.update(textChannelParsed);
                    if (!result.isSuccess()) throw result.error;

                    channelsUpdated.push(result.value);
                } else {
                    result = await this.service.create(textChannelParsed);
                    if (!result.isSuccess()) throw result.error;

                    channelsCreated.push(result.value);
                }

                textChannelsRefreshed.push(result.value);
            }

            const channelObsoletes = textChannelRecords.filter(channelCached => {
                return !textChannelsRefreshed.some(channelRefreshed => channelRefreshed.id === channelCached.id);
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
            const guildRecord = await this.guildService.get(textChannel.guildId)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

            const guildParsed = GuildTransformer.parse(textChannel.guild)
            
            const categoryParsed = textChannel.parent 
                ? CategoryChannelTransformer.parse(textChannel.parent, guildRecord) 
                : null

            const textChannelParsed = TextChannelTransformer.parse({discordTextChannel: textChannel, parent: categoryParsed, guild: guildParsed});
            
            const textChannelCreated = await this.service.create(textChannelParsed)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error));
    
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