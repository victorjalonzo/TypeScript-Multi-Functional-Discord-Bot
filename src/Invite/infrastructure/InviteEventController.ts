import { Collection, GuildMember, Invite, User } from "discord.js";
import { IMemberInput } from "../../Member/domain/IMemberInput.js";
import { cache } from "../../shared/intraestructure/Cache.js";
import { logger } from "../../shared/utils/logger.js";

import {
    UserJoinedWithoutInviterError,
    DuplicateUserInviteError,
    InviterNotFoundError
}
from "../domain/inviteExceptions.js"
import { ICachedGuild } from "../../shared/intraestructure/ICachedGuild.js";

export class InviteEventController {
    constructor (private memberService: IMemberInput) {}

    increaseInviteCount = async (member: GuildMember) => {
        try {
            //Get the member record
            const memberRecordResult = await this.memberService.get(member.id, member.guild.id)
            if (!memberRecordResult.isSuccess()) throw memberRecordResult.error
            const memberRecord = memberRecordResult.value
            
            //If the member already has an inviter, end the function
            if (memberRecord.invitedBy) throw new DuplicateUserInviteError()
    
            //Get the old invite data from the cached guild and the new one
            const guildCached = <ICachedGuild>cache.get(member.guild.id)        
            const newInviteData = await member.guild.invites.fetch()
            const oldInviteData = <Collection<string, Invite>>guildCached.inviteData
            
            //Find the inviter by the invite code updated in the new invite data
            let inviter: User | null | undefined = undefined
    
            for (const [code, oldInvite] of oldInviteData.entries()) {
                const newInvite = newInviteData.get(code)
                if (!newInvite) continue

                if (!newInvite.uses || !oldInvite.uses) continue
                if (newInvite.uses <= oldInvite.uses) continue
    
                inviter = newInvite.inviter
                if (!inviter) break
            }
    
            //If there is no inviter, end the function
            if (inviter === undefined) throw new UserJoinedWithoutInviterError()
            if (inviter === null) throw new InviterNotFoundError()

            //Get the inviter record
            const inviterRecordResult = await this.memberService.get(inviter.id, member.guild.id)
            if (!inviterRecordResult.isSuccess()) throw inviterRecordResult.error
            const inviterRecord = inviterRecordResult.value
    
            //Update the member record object with the inviter data
            memberRecord.invitedBy = inviterRecord
            memberRecord.invitedById = inviter.id
    
            //Update the member record
            const memberRecordUpdateResult = await this.memberService.update(memberRecord)
            if (!memberRecordUpdateResult.isSuccess()) throw memberRecordUpdateResult.error
    
            logger.info(`The user ${member.user.username} (${member.user.id}) joined with an invitation from ${inviter.username} (${inviter.id})`)
        }
        catch (e) {
            if (e instanceof DuplicateUserInviteError) {
                logger.info(`The user ${member.user.username} (${member.user.id}) joined without an invitation`)
            }
        }

    }
}