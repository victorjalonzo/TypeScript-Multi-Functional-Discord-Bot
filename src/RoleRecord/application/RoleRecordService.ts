import { IRepository } from "../../shared/domain/IRepository.js";
import { IRoleRecord } from "../domain/IRoleRecord.js";
import { Result } from "../../shared/domain/Result.js";
import { IRoleRecordInput } from "../domain/IRoleRecordInput.js";

import {
    RoleRecordCreationError,
    RoleRecordUpdateError,
    RoleRecordDeletionError
}
from "../domain/RoleRecordException.js"

export class RoleRecordService implements IRoleRecordInput {
    constructor (private repository: IRepository<IRoleRecord>){}

    create = async (roleRecord: IRoleRecord): Promise<Result<IRoleRecord>> => {
        try {
            const roleRecordCreated = await this.repository.create(roleRecord);
            if (!roleRecordCreated) throw new RoleRecordCreationError()

            return Result.success(roleRecordCreated);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    update = async (roleRecord: IRoleRecord): Promise<Result<IRoleRecord>> => {
        try {
            const filters = {id: roleRecord.id, guildId: roleRecord.guildId}
            const roleRecordUpdated = await this.repository.update(filters, roleRecord);
            if (!roleRecordUpdated) throw new RoleRecordUpdateError()

            return Result.success(roleRecordUpdated);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    get = async (roleId: string, guildId: string): Promise<Result<IRoleRecord>> => {
        try {
            const roleRecord = await this.repository.get({id: roleId, guildId});
            if (!roleRecord) throw new RoleRecordDeletionError()

            return Result.success(roleRecord);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    getAll = async (guildId: string): Promise<Result<IRoleRecord[]>> => {
        try {
            const roleRecords = await this.repository.getAll({guildId});
            return Result.success(roleRecords);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    delete = async (roleId: string, guildId: string): Promise<Result<IRoleRecord>> => {
        try {
            const roleRecord = await this.repository.delete({id: roleId, guildId});
            if (!roleRecord) throw new RoleRecordDeletionError()

            return Result.success(roleRecord);
        }
        catch (e) {
            return Result.failure(e);
        }
    }
}