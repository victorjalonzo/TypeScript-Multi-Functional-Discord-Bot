import { CategoryChannel as DiscordCategoryChannel } from "discord.js"
import { ICategoryChannel } from "../domain/ICategoryChannel.js"
import { CategoryChannel } from "../domain/CategoryChannel.js"
import { cache } from "../../shared/intraestructure/Cache.js"
import { CategoryChannelTransformationError } from "../domain/CategoryChannelExceptions.js"
import { PermissionOverwrite } from "../../shared/domain/IPermissionOverwrite.js"
import { Channel } from "../../shared/intraestructure/Channel.js"

export class CategoryChannelTransformer {
    static parse = (categoryChannel: DiscordCategoryChannel): ICategoryChannel => {
        try {
            const { id, name, position, guildId } = categoryChannel
            const cachedGuild = cache.get(categoryChannel.guild.id)
    
            if (!cachedGuild) throw new Error("The cached guild was not found")

            const permissionOverwrites = Channel.getPermissionOverwrites(categoryChannel)
    
            return new CategoryChannel(id, name, position, permissionOverwrites, [], guildId, cachedGuild)
        }
        catch (e) {
            throw new CategoryChannelTransformationError(String(e))
        }
    }
}