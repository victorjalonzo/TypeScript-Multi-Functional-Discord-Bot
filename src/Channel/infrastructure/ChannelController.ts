import { ChannelService } from "../application/ChannelService.js";
import { Channel } from "../domain/Channel.js";
import { logger } from "../../shared/utils/logger.js";

import {TextChannel, VoiceChannel, CategoryChannel} from "discord.js"

type ChannelType = TextChannel | VoiceChannel | CategoryChannel 

export class ChannelController {
    service: ChannelService
    constructor(service: ChannelService) {
        this.service = service
    }
    parse (incomeChannel: ChannelType): Channel {
        const {name, id, type, position, permissionOverwrites, createdAt, parentId, guildId} = incomeChannel;

        const permissionOverwritesMap: Map<string, any> = permissionOverwrites.valueOf()
        const PermissionOverwriteslist: Record<string, any>[] = []

        permissionOverwritesMap.forEach((value, key) => {
            PermissionOverwriteslist.push({id: key, type: value.type, allow: value.allow,deny: value.deny})
        })

        return new Channel(name, id, type, position, PermissionOverwriteslist, createdAt, parentId, guildId);
    }

    async createChannel(channel: ChannelType): Promise<void> {
        const parsedChannel = this.parse(channel)
        try {
            await this.service.createChannel(parsedChannel)
            logger.info(`The channel ${parsedChannel.name} (${parsedChannel.id}) was created`)
        }
        catch (e) {
            logger.warn(e)
        }
    }

    async updateChannel(oldChannel: ChannelType, newChannel: ChannelType): Promise<void> {
        const oldParsedChannel = this.parse(oldChannel)
        const newParsedChannel = this.parse(newChannel)

        try {
            await this.service.modifyChannel(oldParsedChannel, newParsedChannel)
            logger.info(`The channel ${newParsedChannel.name} (${newParsedChannel.id}) was updated`)
        }
        catch (e) {
            logger.warn(e)
        }
    }

    async deleteChannel(channel: ChannelType): Promise<void> {
        const parsedChannel = this.parse(channel)
        try {
            await this.service.deleteChannel({id: parsedChannel.id, guildId: parsedChannel.guildId}, parsedChannel)
            logger.info(`The channel ${parsedChannel.name} (${parsedChannel.id}) was deleted`)
        }
        catch (e) {
            logger.warn(e)
        }
    }
}