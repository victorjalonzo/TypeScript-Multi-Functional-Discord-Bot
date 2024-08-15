import { TextChannel as DiscordTextChannel } from "discord.js";
import { TextChannel } from "../domain/TextChannel.js";
import { cache } from "../../shared/intraestructure/Cache.js";
import { Channel } from "../../shared/intraestructure/Channel.js";

export class TextChannelTransformer {
    static parse = (incomeTextChannel: DiscordTextChannel): TextChannel => {
        const { name, id, position, parentId, guildId } = incomeTextChannel;
        const cachedGuild = cache.get(incomeTextChannel.guild.id);

        if (!cachedGuild) throw new Error("The cached guild was not found")

        const permissionOverwrites = Channel.getPermissionOverwrites(incomeTextChannel);
        
        return new TextChannel(id, name, position, permissionOverwrites, parentId, guildId, cachedGuild);
    }
}