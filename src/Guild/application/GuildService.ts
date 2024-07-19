import { IGuildInput } from "../domain/IGuildInputPort.js";
import { IRepository } from "../../shared/domain/IRepository.js";
import { IGuild } from "../domain/IGuild.js";

import { CreateGuildRecordError, UpdateGuildRecordError } from "../domain/GuildExceptions.js";

export class GuildService implements IGuildInput {
    constructor(private repository: IRepository<IGuild>) {}

    create = async (guild: IGuild): Promise<Partial<IGuild>> => {
        try {
            return this.repository.create(guild);
        }
        catch (e) {
            throw new CreateGuildRecordError(guild, String(e))
        }
    }

    update = async (oldGuild: IGuild, newGuild: IGuild): Promise<Partial<IGuild>> =>{
        try {
            const filters = { id: oldGuild.id }
            const record = await this.repository.update(filters, newGuild);
            
            if (!record) throw new UpdateGuildRecordError(oldGuild, `The error could not be found`)
            return record
        }
        catch (e) {
            throw new UpdateGuildRecordError(oldGuild, String(e))
        }
    }
}