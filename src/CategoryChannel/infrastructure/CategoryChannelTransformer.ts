import { CategoryChannel as DiscordCategoryChannel } from "discord.js"
import { ICategoryChannel } from "../domain/ICategoryChannel.js"
import { CategoryChannel } from "../domain/CategoryChannel.js"
import { cache } from "../../shared/intraestructure/Cache.js"
import { CategoryChannelTransformationError } from "../domain/CategoryChannelExceptions.js"
import { ChannelUtility } from "../../shared/utils/ChannelUtility.js"
import { CachedGuildNotFoundError } from "../../shared/domain/CachedGuildException.js"

export class CategoryChannelTransformer {
    static parse = (categoryChannel: DiscordCategoryChannel): ICategoryChannel => {
        try {
            const { id, name, position, guildId } = categoryChannel
            
            const cachedGuild = cache.get(categoryChannel.guild.id)
            if (!cachedGuild) throw new CachedGuildNotFoundError();

            const permissionOverwrites = ChannelUtility.getPermissionOverwrites(categoryChannel)
    
            return new CategoryChannel(id, name, position, permissionOverwrites, [], guildId, cachedGuild)
        }
        catch (e) {
            throw new CategoryChannelTransformationError(String(e))
        }
    }
}