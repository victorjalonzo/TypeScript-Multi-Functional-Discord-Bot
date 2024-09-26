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

            const memberRecordResult = await this.memberService.get(member.id, guild.id)
            if (!memberRecordResult.isSuccess()) throw memberRecordResult.error
            const memberRecord = memberRecordResult.value
    
            const result = await this.service.getActiveOne(guild.id)
            if (!result.isSuccess()) throw result.error

            const inviteCode = result.value
            const inviterRecord = inviteCode.member
            
            memberRecord.setInvitedBy(inviterRecord)
            await this.memberService.update(memberRecord)

            await this.inviteCodeService.deactivate(guild.id)

            logger.info(`The member ${member.user.username} (${member.id}) just joined. They were invited by ${inviterRecord.username} (${inviterRecord.id})`)

        }
        catch (e) {
            logger.warn(String(e))
        }
    } 
}