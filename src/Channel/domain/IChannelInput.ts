import {Channel} from "./Channel.js";

export interface IChannelInputPort {
    createChannel(channel: Channel): Promise<Channel>;
    modifyChannel(filter: Record <string, any>, channel: Channel): Promise<Record<string, any>>;
    deleteChannel(filter: Record <string, any>, channel: Channel): Promise<Record<string, any>>;
}