import { IMemberInput } from "../../Member/domain/IMemberInput.js";
import { ChatInputCommandInteraction, User } from "discord.js";
import { BoldText, InlineBlockText } from "../../shared/utils/textFormating.js";
import { EmbedResult } from "../../shared/intraestructure/EmbedResult.js";
import { createInviteCard } from "./Embeds/inviteEmbed.js";
import { IRoleRewardInput } from "../../RoleReward/domain/IRoleRewardInput.js";
import { IRoleReward } from "../../RoleReward/domain/IRoleReward.js";
import { ICreditReward } from "../../CreditReward/domain/ICreditReward.js";
import { GuildNotFoundError } from "../../shared/domain/Exceptions.js";
import { ICreditRewardInput } from "../../CreditReward/domain/ICreditRewardInput.js";
import { generateInviteCardForCreditReward } from "./ImageGenerator/InviteCardForCreditReward.js";
import { getBufferFromURL } from "../../shared/utils/AttachmentBuffer.js";
import { generateInviteCardForRoleReward } from "./ImageGenerator/InviteCardForRoleReward.js";
import { generateInviteCard } from "./ImageGenerator/InviteCard.js";

export class InviteCommandActions {
    constructor(
        private memberService: IMemberInput, 
        private rewardRoleService: IRoleRewardInput,
        private creditRewardService: ICreditRewardInput
    ) {}

    execute = async (interaction: ChatInputCommandInteraction) => {
        try {
            await interaction.deferReply()
            
            const guild = interaction.guild
            const user = interaction.options.getUser('user') ?? interaction.user
    
            if (!guild) throw new GuildNotFoundError()

            const currentInvites = await this.memberService.getInviteMembersCount(user.id, guild.id)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

            const creditRewards = await this.creditRewardService.getAll(guild.id)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

            const roleRewards = await this.rewardRoleService.getAll(guild.id)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))
            
            const avatarImage = user.displayAvatarURL()
            ? await getBufferFromURL(user.displayAvatarURL())
            : null

            creditRewards.length !== 0
            ? await this._showInviteCardForCreditReward(user, interaction, currentInvites, avatarImage, creditRewards)
            
            : roleRewards.length !== 0 
              ? await this._showInviteCardForRoleReward(user, interaction, currentInvites, avatarImage, roleRewards)
              : await this._showInviteCard(user, interaction, currentInvites, avatarImage)
        }
        catch (e) {
            console.log(e)
            return await EmbedResult.fail({description: InlineBlockText(String(e)), interaction})
        }

    }

    _showInviteCardForCreditReward = async (
      user: User,
      interaction: ChatInputCommandInteraction,
      currentInvites: number, 
      avatarImage: Buffer | null, 
      creditRewards: ICreditReward[]
    ) => {

      const result = await this.determineChallenge(currentInvites, creditRewards)
      const reward = <ICreditReward>result.reward

      const description = result.isChallengeCompleted
      ? `**All current credit challenges have been completed.**`
      : `${result.invitesRequiredLeft < result.invitesRequired 
        ? `You only need **${result.invitesRequiredLeft} more invites**` 
        : `You need **${result.invitesRequiredLeft} invites**`
        }` 
        + ` to earn a reward of ${BoldText(reward.name)}`

      const attachment = await generateInviteCardForCreditReward({
        username: user.username,
        avatarImage: avatarImage,
        currentInvites: currentInvites,
        invitesRequired: <number>result.invitesRequired,
        creditRewardAmount: reward.credits
      })

      return await interaction.editReply({content: description, files: [attachment]})
    }

    _showInviteCardForRoleReward = async (
      user: User,
      interaction: ChatInputCommandInteraction,
      currentInvites: number,
      avatarImage: Buffer | null,
      rewardRoles: IRoleReward[]
    ) => {

      const result = await this.determineChallenge(currentInvites, rewardRoles)
      const reward = <IRoleReward>result.reward

      const description = result.isChallengeCompleted
      ? `**All current role challenges have been completed.**`
      : `${result.invitesRequiredLeft < result.invitesRequired 
        ? `You only need **${result.invitesRequiredLeft} more invites**` 
        : `You need **${result.invitesRequiredLeft} invites**`
        }` 
        + ` to earn the role <@&${reward.role.id}> as reward`

      const attachment = await generateInviteCardForRoleReward({
        username: user.username,
        avatarImage: avatarImage,
        currentInvites: currentInvites,
        invitesRequired: <number>result.invitesRequired,
        roleRewardName: reward.role.name
      })

      return await interaction.editReply({content: description, files: [attachment]})
    }

    _showInviteCard = async (
      user: User,
      interaction: ChatInputCommandInteraction,
      currentInvites: number,
      avatarImage: Buffer | null
    ) => {
      const description = `You have ` + `${currentInvites > 1 || currentInvites == 0
        ? BoldText(`${currentInvites} invites`) 
        : BoldText(`${currentInvites} invite`)}.`

      const attachment = await generateInviteCard({
        username: user.username,
        avatarImage: avatarImage,
        currentInvites: currentInvites
      })

      return await interaction.editReply({content: description, files: [attachment]})
    }

    determineChallenge = async (
        currentInvites: number,
        challengeRewards: ICreditReward[] | IRoleReward[]
      ) => {
      
        let isChallengeActive = false;
        let isChallengeCompleted = false;
        let reward: ICreditReward | IRoleReward | undefined = undefined;
        
        let invitesRequired = currentInvites;
        let invitesRequiredLeft: number = 0
      
        if (challengeRewards.length !== 0) {
          const sortedChallengeRewards = challengeRewards.sort(
            (a, b) => a.invitesRequired - b.invitesRequired
          );
      
          isChallengeActive = true;
      
          for (const [index, challengeReward] of sortedChallengeRewards.entries()) {
            if (challengeReward.invitesRequired > currentInvites) {
              invitesRequired = challengeReward.invitesRequired;
              reward = challengeReward;
              break;
            }
      
            if (index === sortedChallengeRewards.length - 1) {
              invitesRequired = challengeReward.invitesRequired;
              reward = challengeReward;
              isChallengeCompleted = true;
            }
          }
        }

        invitesRequiredLeft = <number>invitesRequired - currentInvites
      
        return {
          isChallengeActive,
          isChallengeCompleted,
          invitesRequired,
          invitesRequiredLeft,
          currentInvites,
          reward,
        };
      };
}