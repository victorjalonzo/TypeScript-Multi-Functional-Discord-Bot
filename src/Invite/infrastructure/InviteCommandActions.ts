import { IMemberInput } from "../../Member/domain/IMemberInput.js";
import { ChatInputCommandInteraction } from "discord.js";
import { InlineBlockText } from "../../shared/utils/textFormating.js";
import { EmbedResult } from "../../shared/intraestructure/EmbedResult.js";
import { createInviteCard } from "./Embeds/inviteEmbed.js";
import { IRewardRoleInput } from "../../RewardRole/domain/IRewardRoleInput.js";
import { IRewardRole } from "../../RewardRole/domain/IRewardRole.js";

export class InviteCommandActions {
    constructor(private memberService: IMemberInput, private rewardRoleService: IRewardRoleInput) {}

    execute = async (interaction: ChatInputCommandInteraction) => {
        try {
            const guild = interaction.guild
            let user = interaction.options.getUser('user')
    
            if (!guild) throw new Error("The guild was not found")
            if (!user) user = interaction.user

            await interaction.deferReply()

            let invitesCount = 0

            const memberCountResult = await this.memberService.getInviteMembersCount(user.id, guild.id)
            if (!memberCountResult.isSuccess()) throw memberCountResult.error

            invitesCount = memberCountResult.value

            const rewardRolesResult = await this.rewardRoleService.getAll(guild.id)
            if (!rewardRolesResult.isSuccess()) throw rewardRolesResult.error
            
            const rewardRoles = rewardRolesResult.value

            const { 
                isChallengeActive, 
                isChallengeCompleted, 
                invitesRequired, 
                currentInvites,
                roleId
            } = await this.determineRoleChallenge(invitesCount, rewardRoles)

            let description = ""

            if (!isChallengeActive) {
                description = `You have ${currentInvites} invites.`
            }
            else {
                const role = guild.roles.cache.get(<string>roleId)

                if (isChallengeCompleted) {
                    description = `You have completed the challenge.`
                }
                else {
                    const left = <number>invitesRequired - currentInvites
                    description = `You need ${left} more invites to complete the ${role?.name} challenge.`
                }
            }
            
            const attachment = await createInviteCard({
                displayName: user.username,
                username: user.username,
                avatarURL: user.avatarURL() ?? undefined,
                invitesCount: currentInvites,
                invitesRequired: <number>invitesRequired
            })

            return await interaction.editReply({content: description, files: [attachment]})
        }
        catch (e) {
            console.log(e)
            return await EmbedResult.fail({description: InlineBlockText(String(e)), interaction})
        }

    }

    determineRoleChallenge = async (currentInvites: number, rewardRoles: IRewardRole[]) => {
        let isChallengeActive = false
        let isChallengeCompleted = false
        let invitesRequired: number | undefined
        let roleId: string | undefined
    
        if (rewardRoles.length === 0) {
            invitesRequired = currentInvites
        }
        else {
            isChallengeActive = true

            const sortedRewardRoles = rewardRoles.sort((a, b) => a.invites - b.invites)
    
            for (const reward of sortedRewardRoles) {
                if (reward.invites > currentInvites) {
                    invitesRequired = <number>reward.invites
                    roleId = reward.id
                    break
                }
                if (reward == sortedRewardRoles[sortedRewardRoles.length-1]) {
                    invitesRequired = <number>reward.invites
                    currentInvites = invitesRequired
                    roleId = reward.id
                    isChallengeCompleted = true
                }
            }
        }
    
        return {isChallengeActive, isChallengeCompleted, invitesRequired, currentInvites, roleId }
    }
}