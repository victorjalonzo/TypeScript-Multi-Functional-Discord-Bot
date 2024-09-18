import { IRepository } from "../../shared/domain/IRepository.js";
import { IRoleReward } from "../domain/IRoleReward.js";
import { IRoleRewardInput } from "../domain/IRoleRewardInput.js";  
import { Result } from "../../shared/domain/Result.js";

import { 
    RoleRewardCreationFailed, 
    RoleRewardNotFound, 
    RoleRewardDeletionFailed
} from "../domain/RoleRewardExceptions.js";

export class RoleRewardService implements IRoleRewardInput {
    constructor(private repository: IRepository<IRoleReward>) {}

    async create(reward: IRoleReward): Promise<Result<IRoleReward>> {
        try {
            const rewardRoleCreated = await this.repository.create(reward);
            if (!rewardRoleCreated) throw new RoleRewardCreationFailed()
            return Result.success(rewardRoleCreated);
        }
        catch (e) {
            return Result.failure(String(e));
        }
    }

    async get (roleId: string, guildId: string): Promise<Result<IRoleReward>> {
        try {
            const reward = await this.repository.get({ roleId: roleId, guildId: guildId }, 'role');
            if (!reward) throw new RoleRewardNotFound()
            return Result.success(reward);
        }
        catch (e) {
            return Result.failure(String(e));
        }
    }

    async getAll(guildId: string): Promise<Result<IRoleReward[]>> {
        try {
            const rewardList = await this.repository.getAll({ guildId: guildId }, 'role');
            return Result.success(rewardList);
        }
        catch (e) {
            return Result.failure(String(e));
        }
    }

    async delete(roleId: string, guildId: string): Promise<Result<IRoleReward>> {
        try {
            const deletedReward = await this.repository.delete({ roleId: roleId, guildId: guildId });
            if (!deletedReward) throw new RoleRewardDeletionFailed()
            return Result.success(deletedReward);
        }
        catch (e) {
            return Result.failure(String(e));
        }
    }

    async deleteAll (guildId: string): Promise<Result<IRoleReward[]>> {
        try {
            const rewardList = await this.repository.deleteAll({ guildId: guildId });
            return Result.success(rewardList);
        }
        catch (e) {
            return Result.failure(String(e));
        }
    }
}