import { IMemberInput } from "../domain/IMemberInput.js";
import { Guild as DiscordGuild, GuildMember } from "discord.js";
import { MemberTransformer } from "../infrastructure/MemberTransformer.js";
import { logger } from "../../shared/utils/logger.js";
import { IGuildInput } from "../../Guild/domain/IGuildInput.js";
import { IMember } from "../domain/IMember.js";
import { Result } from "../../shared/domain/Result.js";
import { GuildHasNoMembers } from "../../Guild/domain/GuildExceptions.js";
import { refreshLog } from "../../shared/utils/RefreshLog.js";

export class MemberController {
    constructor(
        private service: IMemberInput,
        private guildService: IGuildInput
    ) {}

    async refresh (guild: DiscordGuild): Promise<void> {
        const membersCreated: IMember[] = []
        const membersUpdated: IMember[] = []
        const membersDeleted: IMember[] = []
        const membersRefreshed: IMember[] = []

        try {
            const [guildCachedResult, membersCachedResult] = await Promise.all([
                await this.guildService.get(guild.id),
                await this.service.getAll(guild.id)
            ])

            if (!guildCachedResult.isSuccess() || !membersCachedResult.isSuccess()) {
                throw guildCachedResult.error || membersCachedResult.error
            }

            const guildCached = guildCachedResult.value
            const membersCached = membersCachedResult.value

            let guildMembers: GuildMember[]

            try {
                guildMembers = (await guild.members.fetch()).toJSON();
            }
            catch (e) {
                throw new Error(`Error fetching members: ${String(e)}`)
            }

            if (guildMembers.length == 0) throw new GuildHasNoMembers()

            for (const guildMember of guildMembers) {
                const match = membersCached.find((m) => m.id == guildMember.id)
                
                const memberParsed = MemberTransformer.parse(guildMember, guildCached)

                let result: Result<IMember>

                if (match) {
                    result = await this.service.update(memberParsed)
                    if (!result.isSuccess()) throw result.error

                    membersUpdated.push(result.value)
                }
                else {
                    result = await this.service.create(memberParsed)
                    if (!result.isSuccess()) throw result.error

                    membersCreated.push(result.value)
                }
                membersRefreshed.push(result.value)
            }
        }
        catch (e) {
            if (!(e instanceof GuildHasNoMembers)) logger.warn(e)
        }
        refreshLog({
            itemsAdded: membersCreated.length,
            itemsUpdated: membersUpdated.length,
            itemsRemoved: membersDeleted.length,
            singular: 'member',
            plural: 'members'
        })
    }

    async create(member: GuildMember): Promise<void> {
        try {
            const guildCachedResult = await this.guildService.get(member.guild.id)
            if (!guildCachedResult.isSuccess()) throw guildCachedResult.error

            const guildCached = guildCachedResult.value

            if (!guildCached) throw new Error(`The guild ${member.guild.id} was not cached`)

            const parsedMember = MemberTransformer.parse(member, guildCached)
            const resul = await this.service.create(parsedMember)

            if (!resul.isSuccess()) throw resul.error
            const record = resul.value

            logger.info(`The member ${record.username} (${record.id}) just joined`)
        }
        catch (e) {
            logger.warn(e)
        }
    }

    async update(oldMember: GuildMember, newMember: GuildMember): Promise<void> {
            const guildCachedResult = await this.guildService.get(oldMember.guild.id)
            if (!guildCachedResult.isSuccess()) throw guildCachedResult.error
            
            const guildCached = guildCachedResult.value

        if (!guildCached) throw new Error(`The guild ${oldMember.guild.id} was not cached`)

        const newParsedMember = MemberTransformer.parse(newMember, guildCached)

        try {
            const result = await this.service.update(newParsedMember)

            if (!result.isSuccess()) throw result.error
            const record = result.value

            logger.info(`The member ${record.username} (${record.id}) was updated`)
        }
        catch (e) {
            logger.warn(e)
        }
    }

    async delete(member: GuildMember): Promise<void> {
        try {
            const filter = { id: member.id, guildId: member.guild.id }
            const result = await this.service.delete(filter)

            if (!result.isSuccess()) throw result.error
            const record = result.value

            logger.info(`The member ${record.username} (${record.id}) was deleted`)
        }

        catch (e) {
            logger.warn(e)
        }
    }   
}