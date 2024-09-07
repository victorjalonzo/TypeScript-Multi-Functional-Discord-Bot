import { ITextChannelInput } from "../domain/ITextChannelInput.js";
import { TextChannel as DiscordTextChannel } from "discord.js";
import { TextChannelTransformer } from "./TextChannelTransformer.js";
import { logger } from "../../shared/utils/logger.js";
import { GuildTransformer } from "../../Guild/infrastructure/GuildTransformer.js";
import { CategoryChannelTransformer } from "../../CategoryChannel/infrastructure/CategoryChannelTransformer.js";

export class TextChannelEventController {
    constructor (
        private service: ITextChannelInput
    ) {}

    createRecord = async (textChannel: DiscordTextChannel): Promise<void> => {
        try {
            const guild = GuildTransformer.parse(textChannel.guild)
            const parent = textChannel.parent ? CategoryChannelTransformer.parse(textChannel.parent) : null

            const textChannelParsed = TextChannelTransformer.parse({discordTextChannel: textChannel, parent, guild});
            
            const result = await this.service.create(textChannelParsed);
            if (!result.isSuccess()) throw result.error
    
            const textChannelCreated = result.value
    
            logger.info(`The text channel ${textChannelCreated.name} (${textChannelCreated.id}) was created`)
        }
        catch (e) {
            logger.warn(e)
        }
    }

    updateRecord = async (oldTextChannel: DiscordTextChannel, newTextChannel: DiscordTextChannel): Promise<void> => {
        try {
            const guild = GuildTransformer.parse(newTextChannel.guild)
            const parent = newTextChannel.parent ? CategoryChannelTransformer.parse(newTextChannel.parent) : null

            const textChannelParsed = TextChannelTransformer.parse({discordTextChannel: newTextChannel,parent, guild});
            
            const result = await this.service.update(textChannelParsed);
            if (!result.isSuccess()) throw result.error

            const textChannelUpdated = result.value
            logger.info(`The text channel ${textChannelUpdated.name} (${textChannelUpdated.id}) was updated`)
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
            logger.info(`The text channel ${textChannelDeleted.name} (${textChannelDeleted.id}) was deleted`)
        }
        catch (e) {
            logger.warn(e)
        }
    }
}