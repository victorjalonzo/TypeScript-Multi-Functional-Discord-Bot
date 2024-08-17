import { IChannelInputPort } from "../domain/IChannelInput.js";
import { IRepository } from "../../shared/domain/IRepository.js";
import { IChannel } from "../domain/IChannel.js";
import { Result } from "../../shared/domain/Result.js";

import { 
    ChannelRecordCreationError,
    ChannelRecordUpdateError,
    ChannelRecordDeleteError
} from "../domain/ChannelExceptions.js";

export class ChannelService implements IChannelInputPort {
    constructor(private repository: IRepository<IChannel>){}

    async create(channel: IChannel): Promise<Result<IChannel>> {
        try {
            const createdChannelRecord = await this.repository.create(channel);
            if (!createdChannelRecord) throw new ChannelRecordCreationError()

            return Result.success(createdChannelRecord);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async update(oldChannel: IChannel, newChannel: IChannel): Promise<Result<IChannel>> {
        try {
            const filters = {id: oldChannel.id, guildId: oldChannel.guildId};
            const updatedChannelRecord = await this.repository.update(filters, newChannel)
            if (!updatedChannelRecord) throw new ChannelRecordUpdateError()

            return Result.success(updatedChannelRecord);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async delete(filters: Record<string, any>): Promise<Result<Record<string, any>>>{
        try {
            const deletedChannelRecord = await this.repository.delete(filters);
            if (!deletedChannelRecord) throw new ChannelRecordDeleteError()

            return Result.success(deletedChannelRecord);
        }
        catch (e) {
            return Result.failure(e);
        }
    }
}