import { Guild, GuildMember } from "discord.js";
import { IRewardRoleInput } from "../domain/IRewardRoleInput.js";
import { IMemberInput } from "../../Member/domain/IMemberInput.js";
import { logger } from "../../shared/utils/logger.js";

import { InviteCountMismatchRewardsError } from "../domain/RewardRoleExceptions.js";

export class RewardRoleEventController {
    constructor (
        private service: IRewardRoleInput, 
        private memberService: IMemberInput
    ) {}

    refresh = async (guild: Guild) => {
        try {
            const roles = guild.roles.cache.size > 0 
            ? guild.roles.cache.map(role => role) 
            : (await guild.roles.fetch()).map(role => role);

            const result = await this.service.getAll(guild.id)
            if (!result.isSuccess()) throw result.error

            const roleRewards = result.value

            const roleRewardsObsolete = roleRewards.filter(roleReward => {
                return !roles.some(role => role.id === roleReward.id)
            })

            for (const roleReward of roleRewardsObsolete) {
                await this.service.delete(roleReward.id, guild.id)
                logger.info(`Role reward ${roleReward.id} was removed due to role deletion`)
            }
            
            logger.info("role rewards: up to date.")
        }
        catch (e) {
            logger.warn(logger.warn(`role rewards: not up to date. Something went wrong: ${String(e)}`))
        }
    }

    assignRoleOnInviteGoal = async (member: GuildMember) => {
        try {
            const guild = member.guild;

            const rewardsResult = await this.service.getAll(guild.id);
            if (!rewardsResult.isSuccess()) throw rewardsResult.error
            
            const rewards = rewardsResult.value;
            if (rewards.length === 0) return
    
            const inviterResult = await this.memberService.get(member.id, guild.id);
            if (!inviterResult.isSuccess()) throw inviterResult.error;
    
            const inviterId = inviterResult.value.invitedBy;
            if (!inviterId) return new Error("The inviterId was not found.");
    
            const inviter = guild.members.cache.get(inviterId);
            if (!inviter) return new Error("The inviter was not found in the guild.");
    
            const invitesCountResult = await this.memberService.getInviteMembersCount(inviterId, guild.id);
            if (!invitesCountResult.isSuccess()) throw invitesCountResult.error;
    
            const invitesCount = invitesCountResult.value;
    
            const sortedRewards = rewards.sort((a, b) => a.invites - b.invites)
    
            let roleId: string | undefined;

            for (const reward of sortedRewards) {
                if (reward.invites >  invitesCount) break;
                roleId = reward.id;
            }
    
            if (!roleId) throw new InviteCountMismatchRewardsError()
            
            const role = guild.roles.cache.get(roleId);
            if (!role) throw new Error("The role was not found in the guild.");
    
            if (role === member.roles.cache.get(roleId)) return;
    
            await member.roles.add(role);

            logger.info(`The role ${role.name} (${role.id}) was added to the member ${member.user.tag}`);
        }
        catch (e) {
            logger.error(e);
        }
    }
}