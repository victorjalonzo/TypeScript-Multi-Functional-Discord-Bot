import { IGuildInput } from "../domain/IGuildInputPort.js";
import { IRepository } from "../../shared/domain/IRepository.js";
import { IGuild } from "../domain/IGuild.js";
import { Result } from "../../shared/domain/Result.js";

import { 
    CreateGuildRecordError, 
    UpdateGuildRecordError,
    DeleteGuildRecordError,
    GuildRecordNotFound
} from "../domain/GuildExceptions.js";

export class GuildService implements IGuildInput {
    constructor(private repository: IRepository<IGuild>) {}

    get = async (filters: Record<string, any>): Promise<Result<IGuild>> => {
        try {
            const record = await this.repository.get(filters);
            if (!record) throw new Error(`The guild record could not be found`)
    
            return Result.success(record);
        }
        catch (e) {
            return Result.failure(String(e));
        }
    }

    create = async (guild: IGuild): Promise<Result<IGuild>> => {
        try {
            const record = await this.repository.create(guild);
            if (!record) throw new Error(`The guild record could not be created`)

            return Result.success(record);
        }
        catch (e) {
            return Result.failure(String(e));
        }
    }

    update = async (oldGuild: IGuild, newGuild: IGuild): Promise<Result<IGuild>> =>{
        try {
            const filters = { id: oldGuild.id }
            const record = await this.repository.update(filters, newGuild);
            
            if (!record) throw new Error(`The record could not be update`)

            return Result.success(record);
        }
        catch (e) {
            return Result.failure(String(e))
        }
    }

    delete = async (guild: IGuild): Promise<Result<Record<string, any>>> => {
        try {
            const filters = { id: guild.id }
            const record = await this.repository.delete(filters);

            if (record.deletedCount === 0) throw Error(`The record could not be deleted`)

            return Result.success(record)
        }
        catch (e) {
            return Result.failure(String(e))
        }
    }   
}