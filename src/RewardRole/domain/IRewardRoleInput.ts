import { Result } from "../../shared/domain/Result.js";
import { IRewardRole } from "./IRewardRole.js";

export interface IRewardRoleInput {
    create: (reward: IRewardRole) => Promise<Result<IRewardRole>>
    get: (roleId: string, guildId: string) => Promise<Result<IRewardRole>>
    getAll: (guildId: string) => Promise<Result<IRewardRole[]>>
    delete: (roleId: string, guildId: string) => Promise<Result<IRewardRole>>
    deleteAll: (guildId: string) => Promise<Result<IRewardRole[]>>
}