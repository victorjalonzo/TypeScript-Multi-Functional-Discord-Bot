import { ChannelInputPort } from "../domain/ChannelInput.js";
import { IChannelRepository } from "../domain/IChannelRepository.js";
import { Channel } from "../domain/Channel.js";

import { 
    ChannelRecordCanNotBeCreated, 
    ChannelRecordCanNotBeModified, 
    ChannelRecordCanNotBeDeleted, 
    ChannelTypeNotSupported 
} from "../domain/ChannelExceptions.js";

export class ChannelService implements ChannelInputPort {
    constructor(private repository: IChannelRepository){}

    async createChannel(channel: Channel): Promise<Channel> {
        const supportChannelTypes = [0, 2, 4,];

        if (!supportChannelTypes.includes(channel.type)) throw new ChannelTypeNotSupported(channel);

        try {
            return await this.repository.insertOne(channel);
        }
        catch (e) {
            throw new ChannelRecordCanNotBeCreated(channel, String(e));
        }
    }

    async modifyChannel(oldChannel: Channel, newChannel: Channel): Promise<Record<string, any>> {
        
        const filters = {id: oldChannel.id, guildId: oldChannel.guildId};

        try {    
            return await this.repository.update(filters, newChannel)
        }
        catch (e) {
            throw new ChannelRecordCanNotBeModified(oldChannel, String(e));
        }
    }

    async deleteChannel(filter: Record<string, any>, channel: Channel): Promise<Record<string, any>>{
        try {
            return await this.repository.deleteOne(filter);
        }
        catch (e) {
            throw new ChannelRecordCanNotBeDeleted(channel, String(e));
        }
    }
}