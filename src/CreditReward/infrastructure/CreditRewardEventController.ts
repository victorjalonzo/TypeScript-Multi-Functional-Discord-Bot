import { GuildMember, TextChannel } from "discord.js";
import { ICreditRewardInput } from "../domain/ICreditRewardInput.js";
import { IMemberInput } from "../../Member/domain/IMemberInput.js";
import { ICreditWalletInput } from "../../CreditWallet/domain/ICreditWalletInput.js";
import { logger } from "../../shared/utils/logger.js";
import { ICreditReward } from "../domain/ICreditReward.js";
import { IGuildInput } from "../../Guild/domain/IGuildInput.js";

export class CreditRewardEventController {
    constructor (
        private service: ICreditRewardInput,
        private guildService: IGuildInput,
        private memberService: IMemberInput,
        private creditWalletService: ICreditWalletInput
    ) {}

    assignCreditsOnInviteGoal = async (member: GuildMember) => {
        try {
            const guild = member.guild;

            //Get all the credits reward available in the guild
            const creditRewards = await this.service.getAll(guild.id)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

            //If there are no credits reward, end the flow
            if (creditRewards.length === 0) return
    
            //Get the cached user who invited the new member
            const memberRecord = await this.memberService.get(member.id, guild.id)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))
    
            const inviterRecord = memberRecord.invitedBy;
            if (!inviterRecord) return new Error("The inviter record was not found.");
    
            //Get the inviter in the guild
            const inviter = guild.members.cache.get(inviterRecord.id) 
            ?? await guild.members.fetch(inviterRecord.id).catch(() => undefined);
            if (!inviter) return new Error("The inviter was not found in the guild.");
    
            //Get the inviter's total invites count
            const invitesCount = await this.memberService.getInviteMembersCount(inviterRecord.id, guild.id)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))
    
            //Sort the credit rewards from lowest to highest
            const sortedCreditRewards = creditRewards.sort((a, b) => a.invitesRequired - b.invitesRequired)
    
            //Get the credit reward that matches the number of invites
            let creditRewardChosen: ICreditReward | undefined;

            for (const creditReward of sortedCreditRewards) {
                if (creditReward.invitesRequired >  invitesCount) break;
                creditRewardChosen = creditReward;
            }

            //If no credit reward matched, end the flow
            if (!creditRewardChosen) return

            //Get the credit wallet of the inviter
            const inviterCreditWallet = await this.creditWalletService.get(inviter.id, guild.id)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

            //Check if the inviter already completed the challenge
            const isChallengeCompleted = inviterCreditWallet.creditRewardChallengesCompleted.find(c => c.id === creditRewardChosen.id);
            if (isChallengeCompleted) return

            //Add credits to the inviter and mark the challenge as completed
            inviterCreditWallet.credits += creditRewardChosen.credits;
            inviterCreditWallet.creditRewardChallengesCompleted.push(creditRewardChosen);

            //Update the inviter's credit wallet
            const creditRewardUpdated = await this.creditWalletService.update(inviterCreditWallet)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

            const creditsRewarded = creditRewardChosen.credits
            const totalCredits = creditRewardUpdated.credits;

            logger.info(`Member ${member.user.username} (${member.id}) was rewarded with ${creditsRewarded} credits for completing ${invitesCount} invites. Now has ${totalCredits}`)

            //Get the guild record
            const guildRecord = await this.guildService.get(guild.id)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

            //Send a message to the default notification channel
            if (guildRecord.defaultNotificationChannel) {
                const channel = <TextChannel>await guild.channels.fetch(guildRecord.defaultNotificationChannel.id);
                if (!channel) return;

                await channel.send(`<@${member.user.id}> was rewarded with ${creditsRewarded} credits for completing the challenge of inviting **${invitesCount} friends**. Now has a balance of ${totalCredits} credits in their account.`)
            }
        }
        catch (e) {
            logger.error(e);
        }
    }
}