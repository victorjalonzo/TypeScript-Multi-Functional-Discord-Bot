import { UpdateWriteOpResult } from 'mongoose';
import { Channel} from '../domain/Channel.js';
import { ChannelModel } from './ChannelSchema.js';
import { DeleteResult } from 'mongodb';
import { IChannelRepository } from '../domain/IChannelRepository.js';

export class MongoChannelRepository implements IChannelRepository {
    async find(filter: Record<string, any> = {}): Promise<Channel[]> {
        return await ChannelModel.find(filter);
    }

    async findOne(filter: Record<string, any>): Promise<Channel | null>{
        return await ChannelModel.findOne(filter);
    }

    async insertOne(channel: Channel): Promise<Channel> {
        return await ChannelModel.create(channel);
    }

    async update(filter: Record<string, any>, channel: Channel): Promise<UpdateWriteOpResult> {
        return await ChannelModel.updateOne(filter, channel);
    }

    async deleteOne(filter: Record<string, any>): Promise<DeleteResult> {
        return await ChannelModel.deleteOne(filter);
    }
}