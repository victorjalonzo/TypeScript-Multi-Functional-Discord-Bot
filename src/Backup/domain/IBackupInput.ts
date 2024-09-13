import { Result } from "../../shared/domain/Result.js"
import { IBackup } from "./IBackup.js"

export interface IBackupInput {
    create(backup: IBackup): Promise<Result<IBackup>>
    get(name: string): Promise<Result<IBackup>>
    getByGuild(guildId: string): Promise<Result<IBackup>>
    getAll (guildId: string): Promise<Result<IBackup[]>>
    delete(name: string): Promise<Result<IBackup>>
}