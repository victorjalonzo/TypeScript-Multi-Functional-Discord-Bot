import { ChannelService } from "../application/ChannelService.js";
import { logger } from "../../shared/utils/logger.js";
import { ChannelTransformer } from "./ChannelTransformer.js";
import { IChannel } from "../domain/IChannel.js";

import {TextChannel, VoiceChannel, CategoryChannel} from "discord.js"

type ChannelType = TextChannel | VoiceChannel | CategoryChannel 

export class ChannelController {
    service: ChannelService
    
    constructor(service: ChannelService) {
        this.service = service
    }

    async createChannel(channel: ChannelType): Promise<Partial<IChannel> | undefined> {
        const parsedChannel = ChannelTransformer.parse(channel)
        try {
            const result = await this.service.create(parsedChannel)

            if (!result.isSuccess()) throw result.error
            
            const record = result.value

            logger.info(`The channel ${record.name} (${record.id}) was created`)
            return result.value
        }
        catch (e) {
            logger.warn(e)
        }
    }

    async updateChannel(oldChannel: ChannelType, newChannel: ChannelType): Promise<void> {
        const oldParsedChannel = ChannelTransformer.parse(oldChannel)
        const newParsedChannel = ChannelTransformer.parse(newChannel)

        try {
            const result = await this.service.update(oldParsedChannel, newParsedChannel)

            if (!result.isSuccess()) throw result.error
            
            const record = result.value

            logger.info(`The channel ${record.name} (${record.id}) was updated`)
        }
        catch (e) {
            logger.warn(e)
        }
    }

    async deleteChannel(channel: ChannelType): Promise<void> {
        const parsedChannel = ChannelTransformer.parse(channel)
        try {
            const filters = {id: parsedChannel.id, guildId: parsedChannel.guildId}
            const result = await this.service.delete(filters)

            if (!result.isSuccess()) throw result.error

            const record = result.value
            logger.info(`The channel ${record.name} (${record.id}) was deleted`)
        }
        catch (e) {
            logger.warn(e)
        }
    }
}