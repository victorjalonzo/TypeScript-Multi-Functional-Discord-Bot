import { IRepository } from "../../shared/domain/IRepository.js";
import { Result } from "../../shared/domain/Result.js";
import { IBackup } from "../domain/IBackup.js";

import { 
    BackupCreationError, 
    BackupDeletionError, 
    BackupNotFoundError 
} from "../domain/BackupExceptions.js";
import { IBackupInput } from "../domain/IBackupInput.js";

export class BackupService implements IBackupInput{
    constructor (private repository: IRepository<IBackup>){}

    async create(backup: IBackup): Promise<Result<IBackup>> {
        try {
            const backupCreated = await this.repository.create(backup);
            if (!backupCreated) throw new BackupCreationError()
            return Result.success(backupCreated);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async get(name: string): Promise<Result<IBackup>> {
        try {
            const backup = await this.repository.get({name});
            if (!backup) throw new BackupNotFoundError()
            return Result.success(backup);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async getByGuild(guildId: string): Promise<Result<IBackup>> {
        try {
            const backup = await this.repository.get({guildId});
            if (!backup) throw new BackupNotFoundError()
            return Result.success(backup);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async getAll(guildId: string): Promise<Result<IBackup[]>> {
        try {
            const backups = await this.repository.getAll({guildId});
            return Result.success(backups);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async delete(name: string): Promise<Result<IBackup>> {
        try {
            const backup = await this.repository.delete({name});
            if (!backup) throw new BackupDeletionError()
            return Result.success(backup);
        }
        catch (e) {
            return Result.failure(e);
        }
    }
}