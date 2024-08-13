import { IMemberInput } from "../domain/IMemberInput.js";
import { GuildMember } from "discord.js";
import { MemberTransformer } from "../infrastructure/MemberTransformer.js";
import { logger } from "../../shared/utils/logger.js";
import { cache } from "../../shared/intraestructure/Cache.js";

export class MemberController {
    constructor(private service: IMemberInput) {}

    async create(member: GuildMember): Promise<void> {
        try {
            const cachedGuild = cache.get(member.guild.id)

            if (!cachedGuild) throw new Error(`The guild ${member.guild.id} was not cached`)

            const parsedMember = MemberTransformer.parse(member, cachedGuild)
            const resul = await this.service.create(parsedMember)

            if (!resul.isSuccess()) throw new Error(resul.error)
            const record = resul.value

            logger.info(`The member ${record.username} (${record.id}) was created`)
        }
        catch (e) {
            logger.warn(e)
        }
    }

    async update(oldMember: GuildMember, newMember: GuildMember): Promise<void> {
        const cachedGuild = cache.get(oldMember.guild.id)

        if (!cachedGuild) throw new Error(`The guild ${oldMember.guild.id} was not cached`)

        const newParsedMember = MemberTransformer.parse(newMember, cachedGuild)

        try {
            const result = await this.service.update(newParsedMember)

            if (!result.isSuccess()) throw new Error(result.error)
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

            if (!result.isSuccess()) throw new Error(result.error)
            const record = result.value

            logger.info(`The member ${record.username} (${record.id}) was deleted`)
        }

        catch (e) {
            logger.warn(e)
        }
    }   
}