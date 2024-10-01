import { Guild, GuildMember, TextChannel } from "discord.js";
import { IRoleRewardInput } from "../domain/IRoleRewardInput.js";
import { IMemberInput } from "../../Member/domain/IMemberInput.js";
import { logger } from "../../shared/utils/logger.js";

import { InviteCountMismatchRewardsError } from "../domain/RoleRewardExceptions.js";
import { IGuildInput } from "../../Guild/domain/IGuildInput.js";

export class RoleRewardEventController {
    constructor (
        private service: IRoleRewardInput,
        private guildService: IGuildInput,
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

            //Get all the rewards available in the guild
            const rewardsResult = await this.service.getAll(guild.id);
            if (!rewardsResult.isSuccess()) throw rewardsResult.error
            const rewards = rewardsResult.value;

            //If there are no rewards, end the flow
            if (rewards.length === 0) return
    
            //Get the user record (inviter) who invited the new member
            const inviterRecordResult = await this.memberService.get(member.id, guild.id);
            if (!inviterRecordResult.isSuccess()) throw inviterRecordResult.error;
            const inviterRecord = inviterRecordResult.value.invitedBy;

            //Check if the user record (inviter) was found
            if (!inviterRecord) return new Error("The inviter was not found.");
    
            //Get the inviter in the guild
            const inviter = guild.members.cache.get(inviterRecord.id) ?? 
            await guild.members.fetch(inviterRecord.id).catch(() => undefined);
            if (!inviter) return new Error("The inviter was not found in the guild.");
    
            //Get the number of invites of the inviter
            const invitesCountResult = await this.memberService.getInviteMembersCount(inviter.id, guild.id);
            if (!invitesCountResult.isSuccess()) throw invitesCountResult.error;
            const invitesCount = invitesCountResult.value;
    
            //Sort the role rewards from lowest to highest
            const sortedRewards = rewards.sort((a, b) => a.invitesRequired - b.invitesRequired)
    
            //Get the role that matches the number of invites
            let roleId: string | undefined;

            for (const reward of sortedRewards) {
                if (reward.invitesRequired >  invitesCount) break;
                roleId = reward.id;
            }
    
            //If the role was not found
            if (!roleId) throw new InviteCountMismatchRewardsError()
            
            //Get the role in the guild
            const role = guild.roles.cache.get(roleId) ?? 
            await guild.roles.fetch(roleId).catch(() => undefined);

            //If the role was not found
            if (!role) throw new Error("The role was not found in the guild.");
    
            //Check if the user already has the role
            if (role === inviter.roles.cache.get(roleId)) return;
    
            //Add the role
            await inviter.roles.add(role);

            logger.info(`The role ${role.name} (${role.id}) was added to the member ${member.user.tag}`);

            const guildRecord = await this.guildService.get(guild.id)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error));

            if (guildRecord.defaultInvoiceChannel) {
                const channel = <TextChannel> await guild.channels.fetch(guildRecord.defaultInvoiceChannel.id)
                if (!channel) return

                await channel.send({
                    content: `<@${member.user.id}> was rewarded with the role <@&${role.id}> for completing the challenge of inviting **${invitesCount} friends**`
                })
            }

        }
        catch (e) {
            logger.error(e);
        }
    }
}