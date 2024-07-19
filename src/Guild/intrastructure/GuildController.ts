import { IGuildInput } from "../domain/IGuildInputPort.js";
import { Guild as DiscordGuild } from "discord.js";
import { GuildTransformer } from "./GuildTransformer.js";
import { logger } from "../../shared/utils/logger.js";

export class GuildController {
    constructor (private service: IGuildInput) {}

     createRecord = async (guild: DiscordGuild) => {
        try {
            const parsedGuild = GuildTransformer.parse(guild)
            const partialGuild = await this.service.create(parsedGuild)

            logger.info(`The guild ${partialGuild.name} (${partialGuild.id}) was created`)
        }
        catch (e) {
            logger.warn(e)
        }   
    }

    updateRecord = async (oldGuild: DiscordGuild, newGuild: DiscordGuild) => {
        try {
            const oldParsedGuild = GuildTransformer.parse(oldGuild)
            const newParsedGuild = GuildTransformer.parse(newGuild)
    
            const partialGuild = await this.service.update(oldParsedGuild, newParsedGuild)

            logger.info(`The guild ${partialGuild.name} (${partialGuild.id}) was updated`)
        }
        catch(e) {
            logger.warn(e)
        }
    }
}