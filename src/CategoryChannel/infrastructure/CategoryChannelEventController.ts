import { ChannelType, CategoryChannel as DiscordCategoryChannel, Guild as DiscordGuild } from "discord.js";
import { ICategoryChannelInput } from "../domain/ICategoryChannelInput.js";
import { CategoryChannelTransformer } from "./CategoryChannelTransformer.js";
import { logger } from "../../shared/utils/logger.js";
import { IGuildInput } from "../../Guild/domain/IGuildInput.js";
import { IGuild } from "../../Guild/domain/IGuild.js";
import { ICategoryChannel } from "../domain/ICategoryChannel.js";
import { Result } from "../../shared/domain/Result.js";
import { printCategoryRefreshStatus } from "../domain/CategoryFreshStatus.js";

export class CategoryChannelEventController {
    constructor (
        private service: ICategoryChannelInput,
        private guildService: IGuildInput
    ) {}

    async refresh (guild: DiscordGuild) {
        try {
            const categoriesCreated = []
            const categoriesUpdated = []
            const categoriesDeleted = []

            const [guildCachedResult, categoriesCachedResult] = await Promise.all([
                this.guildService.get(guild.id),
                this.service.getAll(guild.id)
            ]);

            if (!guildCachedResult.isSuccess() || !categoriesCachedResult.isSuccess()) {
                throw guildCachedResult.error || categoriesCachedResult.error;
            }

            const guildCached = guildCachedResult.value as IGuild;
            const categoriesCached = categoriesCachedResult.value as ICategoryChannel[];

            let categories: DiscordCategoryChannel[]

            try {
                categories = (await guild.channels.fetch())
                    .filter(channel => channel !== null &&channel.type === ChannelType.GuildCategory) 
                    .map(channel => channel as DiscordCategoryChannel);
            } catch (e) {
                throw new Error(`Error fetching categories channels: ${String(e)}`);
            }

            if (categories.length === 0) return printCategoryRefreshStatus({
                categoriesCreated: categoriesCreated.length, 
                categoriesUpdated: categoriesUpdated.length, 
                categoriesDeleted: categoriesDeleted.length
            })

            const categoriesRefreshed: ICategoryChannel[] = []

            for (const category of categories) {
                const match = categoriesCached.find(c => c.id === category.id)

                const categoryParsed: ICategoryChannel = CategoryChannelTransformer.parse(category, guildCached)

                let result: Result<ICategoryChannel>
                
                if (match) {
                    result = await this.service.update(categoryParsed)
                    if (!result.isSuccess()) throw result.error

                    categoriesUpdated.push(result.value)
                }
                else {
                    result = await this.service.create(categoryParsed)
                    if (!result.isSuccess()) throw result.error

                    categoriesCreated.push(result.value)
                }

                categoriesRefreshed.push(result.value)
            }

            const categoryObsoletes = categoriesCached.filter(roleCached => {
                return !categoriesRefreshed.some(roleRefreshed => roleRefreshed.id === roleCached.id)
            })

            for (const categoryObsolete of categoryObsoletes) {
                const result = await this.service.delete(categoryObsolete.id, guild.id)
                if (!result.isSuccess()) throw result.error

                categoriesDeleted.push(categoryObsolete)
            }
            
            printCategoryRefreshStatus({
                categoriesCreated: categoriesCreated.length, 
                categoriesUpdated: categoriesUpdated.length, 
                categoriesDeleted: categoriesDeleted.length
            })

        }
        catch (e) {
            logger.warn(e)
        }
    }

    async createRecord(categoryChannel: DiscordCategoryChannel) {
        try {
            const guildCachedResult = await this.guildService.get(categoryChannel.guildId);
            if (!guildCachedResult.isSuccess()) throw guildCachedResult.error

            const guildCached = guildCachedResult.value as IGuild

            const categoryChannelParsed = CategoryChannelTransformer.parse(categoryChannel, guildCached)

            const result = await this.service.create(categoryChannelParsed)
            if (!result.isSuccess()) throw result.error

            const categoryChannelCreated = result.value

            logger.info(`Category channel ${categoryChannelCreated.name} (${categoryChannelCreated.id}) was created`)
        }
        catch (e){
            logger.warn(e)
        }
    }

    async updateRecord(oldCategoryChannel: DiscordCategoryChannel, newCategoryChannel: DiscordCategoryChannel) {
        try {
            const guildCachedResult = await this.guildService.get(newCategoryChannel.guildId);
            if (!guildCachedResult.isSuccess()) throw guildCachedResult.error

            const guildCached = guildCachedResult.value as IGuild

            const oldCategoryChannelParsed = CategoryChannelTransformer.parse(oldCategoryChannel, guildCached)
            const newCategoryChannelParsed = CategoryChannelTransformer.parse(newCategoryChannel, guildCached)

            const result = await this.service.update(newCategoryChannelParsed)
            if (!result.isSuccess()) throw result.error

            const categoryChannelUpdated = result.value
            logger.info(`Category channel ${categoryChannelUpdated.name} (${categoryChannelUpdated.id}) was updated`)
        }
        catch (e) {
            logger.warn(e)
        }
    }

    async deleteRecord(categoryChannel: DiscordCategoryChannel) {
        try {
            const result = await this.service.delete(categoryChannel.id, categoryChannel.guildId)
            if (!result.isSuccess()) throw result.error

            const categoryChannelDeleted = result.value
            logger.info(`Category channel ${categoryChannelDeleted.name} (${categoryChannelDeleted.id}) was deleted`)
        }
        catch (e) {
            logger.warn(e)
        }
    }
}