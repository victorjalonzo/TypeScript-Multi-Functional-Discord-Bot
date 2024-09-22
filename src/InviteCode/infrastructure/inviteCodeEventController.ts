import { GuildMember } from "discord.js";
import { IMemberInput } from "../../Member/domain/IMemberInput.js";
import { IInviteCodeInput } from "../domain/IInviteCodeInput.js";
import { logger } from "../../shared/utils/logger.js";

export class InviteCodeEventController {
    constructor (
        private service: IInviteCodeInput,
        private memberService: IMemberInput,
        private inviteCodeService: IInviteCodeInput
    ) {}

    increaseInviteCount = async (member: GuildMember) => {
        try {
            const guild = member.guild

            const memberCachedResult = await this.memberService.get(member.id, guild.id)
            if (!memberCachedResult.isSuccess()) throw memberCachedResult.error

            const memberCached = memberCachedResult.value
    
            const result = await this.service.getActiveOne(guild.id)
            if (!result.isSuccess()) throw result.error

            const inviteCode = result.value
            const inviterId = inviteCode.memberId

            const inviter = guild.members.cache.get(inviterId) 
            ?? await guild.members.fetch(inviterId).catch(() => undefined)

            if (!inviter) throw new Error('Inviter not found')
            
            memberCached.invitedBy = inviter.id
            await this.memberService.update(memberCached)

            await this.inviteCodeService.deactivate(guild.id)

            logger.info(`The member ${member.user.username} (${member.id}) just joined. They were invited by ${inviter.user.username} (${inviter.id})`)

        }
        catch (e) {
            logger.warn(String(e))
        }
    } 
}