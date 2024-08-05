import { IGuildInput } from "../domain/IGuildInputPort.js";
import { Guild as DiscordGuild, GuildManager } from "discord.js";
import { GuildTransformer } from "./GuildTransformer.js";
import { logger } from "../../shared/utils/logger.js";
import { IGuild } from "../domain/IGuild.js";
import { cache } from "../../shared/intraestructure/Cache.js";

export class GuildController {
    constructor (private service: IGuildInput) {}
    
    createCache = async (guildManager: GuildManager): Promise<void> => {
        const collection = guildManager.cache

        for (const guildId of collection.keys()) {
            let result = await this.service.get({id: guildId})

            if (result.isSuccess()) {
                const guildRecord = result.value
                cache.create(guildRecord)
                logger.info(`The guild ${guildRecord.name} (${guildRecord.id}) was cached`)
            }
            else {
                const guild = <DiscordGuild>collection.get(guildId)
                const guildParsed = GuildTransformer.parse(guild)
                result = await this.service.create(guildParsed)

                if (!result.isSuccess()) continue
                const guildRecord = result.value
                cache.create(guildRecord)
                logger.info(`The guild ${guildRecord.name} (${guildRecord.id}) was cached`)
            }
        }
    }

    createRecord = async (guild: DiscordGuild): Promise<Partial<IGuild> | undefined> => {
        try {
            const parsedGuild = GuildTransformer.parse(guild)
            const result = await this.service.create(parsedGuild)

            if (!result.isSuccess()) throw new Error(result.error)

            const partialGuild = result.value

            logger.info(`The guild ${partialGuild.name} (${partialGuild.id}) was created`)

            return partialGuild
        }
        catch (e) {
            logger.warn(e)
        }   
    }

    updateRecord = async (oldGuild: DiscordGuild, newGuild: DiscordGuild): Promise<Partial<IGuild> | undefined> => {
        try {
            const oldParsedGuild = GuildTransformer.parse(oldGuild)
            const newParsedGuild = GuildTransformer.parse(newGuild)
    
            const result = await this.service.update(oldParsedGuild, newParsedGuild)

            if (!result.isSuccess()) throw new Error(result.error)

            const partialGuild = result.value

            logger.info(`The guild ${partialGuild.name} (${partialGuild.id}) was updated`)

            return partialGuild
        }
        catch(e) {
            logger.warn(e)
        }
    }

    deleteRecord = async (guild: DiscordGuild): Promise<Partial<IGuild> | undefined> => {
        try {
            const parsedGuild = GuildTransformer.parse(guild)
            const result = await this.service.delete(parsedGuild)

            if (!result.isSuccess()) throw new Error(result.error)

            const partialGuild = result.value

            logger.info(`The guild ${parsedGuild.name} (${parsedGuild.id}) was deleted`)

            return partialGuild
        }
        catch (e) {
            logger.warn(e)
        }
    }
}