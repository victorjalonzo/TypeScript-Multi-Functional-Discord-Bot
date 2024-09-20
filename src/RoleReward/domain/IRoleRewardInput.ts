import { Result } from "../../shared/domain/Result.js";
import { IRoleReward } from "./IRoleReward.js";

export interface IRoleRewardInput {
    create: (reward: IRoleReward) => Promise<Result<IRoleReward>>
    get: (id: string, guildId: string) => Promise<Result<IRoleReward>>
    getAll: (guildId: string) => Promise<Result<IRoleReward[]>>
    delete: (id: string, guildId: string) => Promise<Result<IRoleReward>>
    deleteAll: (guildId: string) => Promise<Result<IRoleReward[]>>
}