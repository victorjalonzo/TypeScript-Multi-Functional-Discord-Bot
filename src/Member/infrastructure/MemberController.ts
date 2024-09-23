import { IMemberInput } from "../domain/IMemberInput.js";
import { Guild as DiscordGuild, GuildMember } from "discord.js";
import { MemberTransformer } from "../infrastructure/MemberTransformer.js";
import { logger } from "../../shared/utils/logger.js";
import { IGuildInput } from "../../Guild/domain/IGuildInput.js";

export class MemberController {
    constructor(
        private service: IMemberInput,
        private guildService: IGuildInput
    ) {}

    async refresh (guild: DiscordGuild): Promise<void> {
        try {
            const guildCachedResult = await this.guildService.get(guild.id)
            if (!guildCachedResult.isSuccess()) throw guildCachedResult.error

            const guildCached = guildCachedResult.value

            const guildMembers = (await guild.members.fetch()).toJSON();

            const membersStoredResult = await this.service.getAll(guild.id)
            if (!membersStoredResult.isSuccess()) throw membersStoredResult.error

            const membersStored = membersStoredResult.value

            const guildMembersNotStored = guildMembers.filter(guildMember => {
                return !membersStored.some(member => member.id === guildMember.id)
            })

            if (guildMembersNotStored.length === 0) {
                logger.info("members: up to date.")
                return
            }

            for (const guildMember of guildMembersNotStored) {
                const member = MemberTransformer.parse(guildMember, guildCached)

                const memberCreatedResult = await this.service.create(member)
                if (!memberCreatedResult.isSuccess()) throw memberCreatedResult.error

                logger.info(`The member ${member.username} (${member.id}) was created`)
            }

            logger.info(`The members of ${guild.name} (${guild.id}) were refreshed.\nTotal members stored after refresh: ${guildMembersNotStored.length}`)
        }
        catch (e) {
            logger.warn(e)
        }
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