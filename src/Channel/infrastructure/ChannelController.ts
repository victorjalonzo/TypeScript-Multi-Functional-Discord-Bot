import { ChannelService } from "../application/ChannelService.js";
import { logger } from "../../shared/utils/logger.js";
import { ChannelTransformer } from "./ChannelTransformer.js";

import {TextChannel, VoiceChannel, CategoryChannel} from "discord.js"

type ChannelType = TextChannel | VoiceChannel | CategoryChannel 

export class ChannelController {
    service: ChannelService
    constructor(service: ChannelService) {
        this.service = service
    }

    async createChannel(channel: ChannelType): Promise<void> {
        const parsedChannel = ChannelTransformer.parse(channel)
        try {
            await this.service.createChannel(parsedChannel)
            logger.info(`The channel ${parsedChannel.name} (${parsedChannel.id}) was created`)
        }
        catch (e) {
            logger.warn(e)
        }
    }

    async updateChannel(oldChannel: ChannelType, newChannel: ChannelType): Promise<void> {
        const oldParsedChannel = ChannelTransformer.parse(oldChannel)
        const newParsedChannel = ChannelTransformer.parse(newChannel)

        try {
            await this.service.modifyChannel(oldParsedChannel, newParsedChannel)
            logger.info(`The channel ${newParsedChannel.name} (${newParsedChannel.id}) was updated`)
        }
        catch (e) {
            logger.warn(e)
        }
    }

    async deleteChannel(channel: ChannelType): Promise<void> {
        const parsedChannel = ChannelTransformer.parse(channel)
        try {
            await this.service.deleteChannel({id: parsedChannel.id, guildId: parsedChannel.guildId}, parsedChannel)
            logger.info(`The channel ${parsedChannel.name} (${parsedChannel.id}) was deleted`)
        }
        catch (e) {
            logger.warn(e)
        }
    }
}