import { IRole } from "./IRole.js"
import { Result } from "../../shared/domain/Result.js"

export interface IRoleInput {
    create (role: IRole): Promise<Result<IRole>>
    update (role: IRole): Promise<Result<IRole>>
    get (roleId: string, guildId: string): Promise<Result<IRole>>
    getAll (guildId: string): Promise<Result<IRole[]>>
    delete (roleId: string, guildId: string): Promise<Result<IRole>>
}