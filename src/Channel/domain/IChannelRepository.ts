import { Channel } from './Channel.js'

export interface IChannelRepository {
    find(filter: Record<string, any>): Promise<Channel[]> 
    findOne(filter: Record<string, any>): Promise<Channel | null>
    insertOne(channel: Channel): Promise<Channel>
    update(filter: Record<string, any>, channel: Channel): Promise<Record<string, any>>
    deleteOne(filter: Record<string, any>): Promise<Record<string, any>>
}