import { ITextChannelInput } from "../domain/ITextChannelInput.js";
import { TextChannel as DiscordTextChannel } from "discord.js";
import { TextChannelTransformer } from "./TextChannelTransformer.js";
import { logger } from "../../shared/utils/logger.js";

export class TextChannelEventController {
    constructor (private service: ITextChannelInput) {}

    createRecord = async (textChannel: DiscordTextChannel): Promise<void> => {
        try {
            const textChannelParsed = TextChannelTransformer.parse(textChannel);
            const result =await this.service.create(textChannelParsed);
    
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
            const oldTextChannelParsed = TextChannelTransformer.parse(oldTextChannel);
            const newTextChannelParsed = TextChannelTransformer.parse(newTextChannel);
            const result = await this.service.update(newTextChannelParsed);

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
            const result = await this.service.delete(textChannel.id, textChannel.guild.id);
    
            if (!result.isSuccess()) throw result.error
    
            const textChannelDeleted = result.value
            logger.info(`The text channel ${textChannelDeleted.name} (${textChannelDeleted.id}) was deleted`)
        }
        catch (e) {
            logger.warn(e)
        }
    }
}