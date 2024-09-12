import { IRepository } from "../../shared/domain/IRepository.js";
import { IRewardRole } from "../domain/IRewardRole.js";
import { IRewardRoleInput } from "../domain/IRewardRoleInput.js";  
import { Result } from "../../shared/domain/Result.js";

import { 
    RewardRoleCreationFailed, 
    RewardRoleNotFound, 
    RewardRoleDeletionFailed
} from "../domain/RewardRoleExceptions.js";

export class RewardRoleService implements IRewardRoleInput {
    constructor(private repository: IRepository<IRewardRole>) {}

    async create(reward: IRewardRole): Promise<Result<IRewardRole>> {
        try {
            const rewardRoleCreated = await this.repository.create(reward);
            if (!rewardRoleCreated) throw new RewardRoleCreationFailed()
            return Result.success(rewardRoleCreated);
        }
        catch (e) {
            return Result.failure(String(e));
        }
    }

    async get (roleId: string, guildId: string): Promise<Result<IRewardRole>> {
        try {
            const reward = await this.repository.get({ roleId: roleId, guildId: guildId }, 'role');
            if (!reward) throw new RewardRoleNotFound()
            return Result.success(reward);
        }
        catch (e) {
            return Result.failure(String(e));
        }
    }

    async getAll(guildId: string): Promise<Result<IRewardRole[]>> {
        try {
            const rewardList = await this.repository.getAll({ guildId: guildId }, 'role');
            return Result.success(rewardList);
        }
        catch (e) {
            return Result.failure(String(e));
        }
    }

    async delete(roleId: string, guildId: string): Promise<Result<IRewardRole>> {
        try {
            const deletedReward = await this.repository.delete({ roleId: roleId, guildId: guildId });
            if (!deletedReward) throw new RewardRoleDeletionFailed()
            return Result.success(deletedReward);
        }
        catch (e) {
            return Result.failure(String(e));
        }
    }

    async deleteAll (guildId: string): Promise<Result<IRewardRole[]>> {
        try {
            const rewardList = await this.repository.deleteAll({ guildId: guildId });
            return Result.success(rewardList);
        }
        catch (e) {
            return Result.failure(String(e));
        }
    }
}