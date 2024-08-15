import { CategoryChannel as DiscordCategoryChannel } from "discord.js";
import { ICategoryChannelInput } from "../domain/ICategoryChannelInput.js";
import { CategoryChannelTransformer } from "./CategoryChannelTransformer.js";
import { logger } from "../../shared/utils/logger.js";

export class CategoryChannelEventController {
    constructor (private service: ICategoryChannelInput) {}

    async createRecord(categoryChannel: DiscordCategoryChannel) {
        try {
            const categoryChannelParsed = CategoryChannelTransformer.parse(categoryChannel)

            const result = await this.service.create(categoryChannelParsed)
            if (!result.isSuccess()) throw result.error

            const categoryChannelCreated = result.value

            logger.info(`The category channel ${categoryChannelCreated.name} (${categoryChannelCreated.id}) was created`)
        }
        catch (e){
            logger.warn(e)
        }
    }

    async updateRecord(oldCategoryChannel: DiscordCategoryChannel, newCategoryChannel: DiscordCategoryChannel) {
        try {
            const oldCategoryChannelParsed = CategoryChannelTransformer.parse(oldCategoryChannel)
            const newCategoryChannelParsed = CategoryChannelTransformer.parse(newCategoryChannel)

            const result = await this.service.update(newCategoryChannelParsed)
            if (!result.isSuccess()) throw result.error

            const categoryChannelUpdated = result.value
            logger.info(`The category channel ${categoryChannelUpdated.name} (${categoryChannelUpdated.id}) was updated`)
        }
        catch (e) {
            logger.warn(e)
        }
    }

    async deleteRecord(categoryChannel: DiscordCategoryChannel) {
        try {
            const categoryChannelParsed = CategoryChannelTransformer.parse(categoryChannel)
            const result = await this.service.delete(categoryChannelParsed.id, categoryChannelParsed.guildId)

            if (!result.isSuccess()) throw result.error

            const categoryChannelDeleted = result.value
            logger.info(`The category channel ${categoryChannelDeleted.name} (${categoryChannelDeleted.id}) was deleted`)
        }
        catch (e) {
            logger.warn(e)
        }
    }
}