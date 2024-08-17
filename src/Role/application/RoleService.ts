import { IRepository } from "../../shared/domain/IRepository.js";
import { IRole } from "../domain/IRole.js";
import { Result } from "../../shared/domain/Result.js";
import { IRoleInput } from "../domain/IRoleInput.js";

import {
    RoleCreationError,
    RoleNotFoundError,
    RoleUpdateError,
    RoleDeletionError
}
from "../domain/RoleException.js"

export class RoleService implements IRoleInput {
    constructor (private repository: IRepository<IRole>){}

    create = async (roleRecord: IRole): Promise<Result<IRole>> => {
        try {
            const roleCreated = await this.repository.create(roleRecord);
            if (!roleCreated) throw new RoleCreationError()

            return Result.success(roleCreated);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    update = async (roleRecord: IRole): Promise<Result<IRole>> => {
        try {
            const filters = {id: roleRecord.id, guildId: roleRecord.guildId}
            const roleUpdated = await this.repository.update(filters, roleRecord);
            if (!roleUpdated) throw new RoleUpdateError()

            return Result.success(roleUpdated);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    get = async (roleId: string, guildId: string): Promise<Result<IRole>> => {
        try {
            const role = await this.repository.get({id: roleId, guildId});
            if (!role) throw new RoleNotFoundError()

            return Result.success(role);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    getAll = async (guildId: string): Promise<Result<IRole[]>> => {
        try {
            const roles = await this.repository.getAll({guildId});
            return Result.success(roles);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    delete = async (roleId: string, guildId: string): Promise<Result<IRole>> => {
        try {
            const roleDeleted = await this.repository.delete({id: roleId, guildId});
            if (!roleDeleted) throw new RoleDeletionError()

            return Result.success(roleDeleted);
        }
        catch (e) {
            return Result.failure(e);
        }
    }
}