import { GuildMember } from "discord.js";
import { ICreditRewardInput } from "../domain/ICreditRewardInput.js";
import { IMemberInput } from "../../Member/domain/IMemberInput.js";
import { ICreditWalletInput } from "../../CreditWallet/domain/ICreditWalletInput.js";
import { logger } from "../../shared/utils/logger.js";

export class CreditRewardEventController {
    constructor (
        private service: ICreditRewardInput,
        private memberService: IMemberInput,
        private creditWalletService: ICreditWalletInput
    ) {}

    assignCreditsOnInviteGoal = async (member: GuildMember) => {
        try {
            const guild = member.guild;

            const creditRewardsResult = await this.service.getAll(guild.id);
            if (!creditRewardsResult.isSuccess()) throw creditRewardsResult.error
            
            const creditRewards = creditRewardsResult.value;
            if (creditRewards.length === 0) return
    
            const inviterResult = await this.memberService.get(member.id, guild.id);
            if (!inviterResult.isSuccess()) throw inviterResult.error;
    
            const inviterId = inviterResult.value.invitedBy;
            if (!inviterId) return new Error("The inviterId was not found.");
    
            const inviter = guild.members.cache.get(inviterId) ?? await guild.members.fetch(inviterId).catch(() => undefined);
            if (!inviter) return new Error("The inviter was not found in the guild.");
    
            const invitesCountResult = await this.memberService.getInviteMembersCount(inviterId, guild.id);
            if (!invitesCountResult.isSuccess()) throw invitesCountResult.error;
    
            const invitesCount = invitesCountResult.value;
    
            const sortedCreditRewards = creditRewards.sort((a, b) => a.invitesRequired - b.invitesRequired)
    
            let credits: number | undefined;

            for (const creditReward of sortedCreditRewards) {
                if (creditReward.invitesRequired >  invitesCount) break;
                credits = creditReward.credits;
            }

            if (!credits) return

            const totalCreditsResult = await this.creditWalletService.increment(member.id, guild.id, credits);
            if (!totalCreditsResult.isSuccess()) throw totalCreditsResult.error;

            const totalCredits = totalCreditsResult.value;

            logger.info(`The member ${member.user.tag} (${member.id}) was rewarded with ${credits} credits for completing ${invitesCount} invites. Now has ${totalCredits}`)
        }
        catch (e) {
            logger.error(e);
        }
    }
}