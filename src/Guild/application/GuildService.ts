import { IGuildInput } from "../domain/IGuildInput.js";
import { IRepository } from "../../shared/domain/IRepository.js";
import { IGuild } from "../domain/IGuild.js";
import { Result } from "../../shared/domain/Result.js";

import { 
    GuildRecordCreationError,
    GuildRecordUpdateError,
    GuildRecordNotFoundError,
    GuildRecordDeletionError
} from "../domain/GuildExceptions.js";

export class GuildService implements IGuildInput {
    constructor(private repository: IRepository<IGuild>) {}

    create = async (guild: IGuild): Promise<Result<IGuild>> => {
        try {
            const guildRecordCreated = await this.repository.create(guild);
            if (!guildRecordCreated) throw new GuildRecordCreationError()

            return Result.success(guildRecordCreated);
        }
        catch (e) {
            return Result.failure(e)
        }
    }

    get = async (filters: Record<string, any>): Promise<Result<IGuild>> => {
        try {
            const guildRecord = await this.repository.get(filters);
            if (!guildRecord) throw new GuildRecordNotFoundError()
    
            return Result.success(guildRecord);
        }
        catch (e) {
            return Result.failure(e)
        }
    }

    update = async (oldGuild: IGuild, newGuild: IGuild): Promise<Result<IGuild>> =>{
        try {
            const filters = { id: oldGuild.id }
            const guildRecordUpdated = await this.repository.update(filters, newGuild);
            
            if (!guildRecordUpdated) throw new GuildRecordUpdateError()

            return Result.success(guildRecordUpdated);
        }
        catch (e) {
            return Result.failure(e)
        }
    }

    delete = async (guild: IGuild): Promise<Result<Record<string, any>>> => {
        try {
            const filters = { id: guild.id }
            const guildDeleted = await this.repository.delete(filters);

            if (!guildDeleted) throw new GuildRecordDeletionError()

            return Result.success(guildDeleted)
        }
        catch (e) {
            return Result.failure(e)
        }
    }   
}