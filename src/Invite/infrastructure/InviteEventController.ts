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

export class InviteEventController {
    constructor (private memberService: IMemberInput) {}

    increaseInviteCount = async (member: GuildMember) => {
        try {
            const guild = member.guild;

            const cachedGuild = cache.get(guild.id)
            if (!cachedGuild) throw new Error(`The guild ${member.guild.id} was not cached`)
    
            const inviteManager = guild.invites
    
            let inviter: User | null | undefined = undefined
    
            const newInviteData = await inviteManager.fetch()
            const oldInviteData = <Collection<string, Invite>>cachedGuild.inviteData
    
            for (const [code, oldInvite] of oldInviteData.entries()) {
                const newInvite = newInviteData.get(code)
                if (!newInvite) continue

                if (!newInvite.uses) continue
                if (!oldInvite.uses) continue
    
                if (newInvite.uses <= oldInvite.uses) continue
    
                inviter = newInvite.inviter
                if (!inviter) break
            }
    
            if (inviter === undefined) throw new UserJoinedWithoutInviterError()
            if (inviter === null) throw new InviterNotFoundError()
    
            const memberResult = await this.memberService.get(member.id, guild.id)
            if (!memberResult.isSuccess()) throw memberResult.error
    
            const memberRecord = memberResult.value
            if (memberRecord.invitedBy) throw new DuplicateUserInviteError()
    
            memberRecord.invitedBy = inviter.id
    
            await this.memberService.update(memberRecord)
    
            logger.info(`The user ${member.user.username} (${member.user.id}) joined with an invitation from ${inviter.username} (${inviter.id})`)
        }
        catch (e) {
            logger.warn(e)
        }

    }
}