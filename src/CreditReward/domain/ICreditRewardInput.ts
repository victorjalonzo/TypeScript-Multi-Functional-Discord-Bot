import { Result } from "../../shared/domain/Result.js"
import { ICreditReward } from "./ICreditReward.js"

export interface ICreditRewardInput {
    create (creditReward: ICreditReward): Promise<Result<ICreditReward>>
    get(id: string ): Promise<Result<ICreditReward>>
    getAll(guildId: string): Promise<Result<ICreditReward[]>>
    delete(id: string): Promise<Result<ICreditReward>>
    deleteAll(guildId: string): Promise<Result<ICreditReward[]>>
}