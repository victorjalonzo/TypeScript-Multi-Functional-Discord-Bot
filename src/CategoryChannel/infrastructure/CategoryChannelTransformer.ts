import { CategoryChannel as DiscordCategoryChannel } from "discord.js"
import { ICategoryChannel } from "../domain/ICategoryChannel.js"
import { CategoryChannel } from "../domain/CategoryChannel.js"
import { cache } from "../../shared/intraestructure/Cache.js"
import { CategoryChannelTransformationError } from "../domain/CategoryChannelExceptions.js"
import { ChannelUtility } from "../../shared/utils/ChannelUtility.js"
import { CachedGuildNotFoundError } from "../../shared/domain/CachedGuildException.js"
import { IGuild } from "../../Guild/domain/IGuild.js"

export class CategoryChannelTransformer {
    static parse = (categoryChannel: DiscordCategoryChannel, guild: IGuild): ICategoryChannel => {
        try {
            const { id, name, position, guildId } = categoryChannel

            const permissionOverwrites = ChannelUtility.getPermissionOverwrites(categoryChannel)
    
            return new CategoryChannel(id, name, position, permissionOverwrites, [], guildId, guild)
        }
        catch (e) {
            throw new CategoryChannelTransformationError(String(e))
        }
    }
}