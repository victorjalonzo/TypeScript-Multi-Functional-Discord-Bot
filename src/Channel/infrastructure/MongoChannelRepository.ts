import { Channel } from '../domain/Channel.js';
import { ChannelModel } from './ChannelSchema.js';
import { IChannelRepository } from '../domain/IChannelRepository.js';
import { UpdateResult, DeleteResult } from 'mongodb';

export class MongoChannelRepository implements IChannelRepository {
    async find(filter: Record<string, any> = {}): Promise<Channel[]> {
        return await ChannelModel.find(filter).lean().exec(); // Añadir lean() para mejor rendimiento
    }

    async findOne(filter: Record<string, any>): Promise<Channel | null> {
        return await ChannelModel.findOne(filter).lean().exec();
    }

    async insertOne(channel: Channel): Promise<Channel> {
        const createdChannel = new ChannelModel(channel);
        await createdChannel.save();
        return createdChannel.toObject();
    }

    async update(filter: Record<string, any>, channel: Channel): Promise<UpdateResult> {
        return await ChannelModel.updateOne(filter, channel).exec();
    }

    async deleteOne(filter: Record<string, any>): Promise<DeleteResult> {
        return await ChannelModel.deleteOne(filter).exec();
    }
}