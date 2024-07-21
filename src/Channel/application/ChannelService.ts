import { IChannelInputPort } from "../domain/IChannelInput.js";
import { IRepository } from "../../shared/domain/IRepository.js";
import { IChannel } from "../domain/IChannel.js";
import { Result } from "../../shared/domain/Result.js";

import { 
    ChannelRecordCanNotBeCreated, 
    ChannelRecordCanNotBeModified, 
    ChannelRecordCanNotBeDeleted, 
    ChannelTypeNotSupported 
} from "../domain/ChannelExceptions.js";

export class ChannelService implements IChannelInputPort {
    constructor(private repository: IRepository<IChannel>){}

    async create(channel: IChannel): Promise<Result<IChannel>> {
        try {
            const record = await this.repository.create(channel);
            if (!record) throw new Error(`The channel record could not be created`)

            return Result.success(record);
        }
        catch (e) {
            return Result.failure(String(e));
        }
    }

    async update(oldChannel: IChannel, newChannel: IChannel): Promise<Result<IChannel>> {
        
        const filters = {id: oldChannel.id, guildId: oldChannel.guildId};

        try {
            const record = await this.repository.update(filters, newChannel)
            if (!record) throw new Error (`The channel record could not be updated`)

            return Result.success(record);
        }
        catch (e) {
            return Result.failure(String(e));
        }
    }

    async delete(filters: Record<string, any>): Promise<Result<Record<string, any>>>{
        try {
            const record = await this.repository.delete(filters);
            if (!record) throw new Error (`The channel record could not be deleted`)

            return Result.success(record);
        }
        catch (e) {
            return Result.failure(String(e));
        }
    }
}