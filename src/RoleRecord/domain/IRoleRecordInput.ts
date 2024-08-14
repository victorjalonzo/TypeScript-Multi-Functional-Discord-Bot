import { IRoleRecord } from "./IRoleRecord.js"
import { Result } from "../../shared/domain/Result.js"

export interface IRoleRecordInput {
    create (role: IRoleRecord): Promise<Result<IRoleRecord>>
    update (role: IRoleRecord): Promise<Result<IRoleRecord>>
    get (roleId: string, guildId: string): Promise<Result<IRoleRecord>>
    getAll (guildId: string): Promise<Result<IRoleRecord[]>>
    delete (roleId: string, guildId: string): Promise<Result<IRoleRecord>>
}