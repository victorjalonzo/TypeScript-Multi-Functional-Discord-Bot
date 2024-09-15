import { IGuildInput } from "../domain/IGuildInput.js";
import { Guild as DiscordGuild, GuildManager, Invite } from "discord.js";
import { GuildTransformer } from "./GuildTransformer.js";
import { logger } from "../../shared/utils/logger.js";
import { IGuild } from "../domain/IGuild.js";
import { cache } from "../../shared/intraestructure/Cache.js";

export class GuildController {
    constructor (private service: IGuildInput) {}
    
    createCache = async (guildManager: GuildManager): Promise<void> => {
        const collection = guildManager.cache

        for (const guildId of collection.keys()) {
            let guildRecord: IGuild | undefined = undefined
            const guild = <DiscordGuild>collection.get(guildId)

            let result = await this.service.get(guildId)

            if (result.isSuccess()) {
                guildRecord = result.value
            }
            else {
                const guildParsed = GuildTransformer.parse(guild)
                result = await this.service.create(guildParsed)

                if (!result.isSuccess()) continue
                guildRecord = result.value
            }

            if (!guildRecord) continue

            const inviteData = await guild.invites.fetch()

            const cacheInviteData = new Map()

            for (const [code, invite] of inviteData.entries()) {
                cacheInviteData.set(code, {
                    code: code,
                    inviter: invite.inviter,
                    uses: invite.uses
                })
            }

            guildRecord.inviteData = cacheInviteData

            cache.create(guildRecord)
            logger.info(`The guild ${guildRecord.name} (${guildRecord.id}) was cached`)
        }
    }

    createRecord = async (guild: DiscordGuild): Promise<Partial<IGuild> | undefined> => {
        try {
            const parsedGuild = GuildTransformer.parse(guild)
            const result = await this.service.create(parsedGuild)

            if (!result.isSuccess()) throw result.error

            const partialGuild = result.value

            logger.info(`The guild ${partialGuild.name} (${partialGuild.id}) was created`)

            return partialGuild
        }
        catch (e) {
            logger.warn(e)
        }   
    }

    updateRecord = async (oldGuild: DiscordGuild, newGuild: DiscordGuild): Promise<Partial<IGuild> | undefined> => {
        try {
            const oldParsedGuild = GuildTransformer.parse(oldGuild)
            const newParsedGuild = GuildTransformer.parse(newGuild)
    
            const result = await this.service.update(newParsedGuild)

            if (!result.isSuccess()) throw result.error

            const partialGuild = result.value

            logger.info(`The guild ${partialGuild.name} (${partialGuild.id}) was updated`)

            return partialGuild
        }
        catch(e) {
            logger.warn(e)
        }
    }

    deleteRecord = async (guild: DiscordGuild): Promise<Partial<IGuild> | undefined> => {
        try {
            const result = await this.service.delete(guild.id)
            if (!result.isSuccess()) throw result.error

            const deletedGuild = result.value

            logger.info(`The guild ${deletedGuild.name} (${deletedGuild.id}) was deleted`)
            return deletedGuild
        }
        catch (e) {
            logger.warn(e)
        }
    }
}