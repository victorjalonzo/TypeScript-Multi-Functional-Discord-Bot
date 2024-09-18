import { Result } from "../../shared/domain/Result.js";
import { IRoleReward } from "./IRoleReward.js";

export interface IRoleRewardInput {
    create: (reward: IRoleReward) => Promise<Result<IRoleReward>>
    get: (roleId: string, guildId: string) => Promise<Result<IRoleReward>>
    getAll: (guildId: string) => Promise<Result<IRoleReward[]>>
    delete: (roleId: string, guildId: string) => Promise<Result<IRoleReward>>
    deleteAll: (guildId: string) => Promise<Result<IRoleReward[]>>
}