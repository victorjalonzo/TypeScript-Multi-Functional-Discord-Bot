import { GuildMember } from "discord.js";
import { IMemberInput } from "../../Member/domain/IMemberInput.js";
import { IInviteCodeInput } from "../domain/IInviteCodeInput.js";
import { logger } from "../../shared/utils/logger.js";
import { InviteCodeNotFoundError } from "../domain/InviteCodeExceptions.js";

export class InviteCodeEventController {
    constructor (
        private service: IInviteCodeInput,
        private memberService: IMemberInput,
        private inviteCodeService: IInviteCodeInput
    ) {}

    increaseInviteCount = async (member: GuildMember) => {
        try {
            const guild = member.guild

            const memberRecord = await this.memberService.get(member.id, guild.id)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))
    
            const inviteCode = await this.service.getActiveOne(guild.id)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

            const inviterRecord = inviteCode.member
            
            memberRecord.setInvitedBy(inviterRecord)
            await this.memberService.update(memberRecord)

            await this.inviteCodeService.deactivate(guild.id)

            logger.info(`The member ${member.user.username} (${member.id}) just joined. They were invited by ${inviterRecord.username} (${inviterRecord.id})`)

        }
        catch (e) {
            if (e instanceof InviteCodeNotFoundError) return
            logger.warn(String(e))
        }
    } 
}