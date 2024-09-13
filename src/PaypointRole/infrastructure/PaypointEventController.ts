import {Message, PartialMessage, ChannelType} from "discord.js"
import { IPaypointInput } from "../domain/IPaypointInput.js"
import { GuildNotFoundError } from "../../shared/domain/Exceptions.js"
import { logger } from "../../shared/utils/logger.js"

export class PaypointEventController {
    constructor (private service: IPaypointInput){}

    deleteUpdatableMessageID = async (message: Message | PartialMessage | Record<string, any>) => {
        try {
            const guildID = message.guildId
            const channelId = message.channelId
            const messageId = message.id
    
            const result = await this.service.getByMessageID(messageId)
            if (!result.isSuccess()) return
    
            const paypoint = result.value
    
            paypoint.channelId = null
            paypoint.messageId = null
    
            const updateResult = await this.service.update(paypoint)
            if (!updateResult.isSuccess()) throw updateResult.error

            logger.info(`The Paypoint was deleted`)
        }
        catch (e) {
            logger.info(e)
        }
    }
}