import { TextChannel as DiscordTextChannel } from "discord.js";
import { TextChannel } from "../domain/TextChannel.js";
import { cache } from "../../shared/intraestructure/Cache.js";
import { ChannelUtility } from "../../shared/utils/ChannelUtility.js";
import { CachedGuildNotFoundError } from "../../shared/domain/CachedGuildException.js";
import { ICategoryChannel } from "../../CategoryChannel/domain/ICategoryChannel.js";
import { IGuild } from "../../Guild/domain/IGuild.js";

export class TextChannelTransformer {
    static parse = ({discordTextChannel, parent, guild}: {discordTextChannel: DiscordTextChannel, parent: ICategoryChannel | null, guild: IGuild}): TextChannel => {
        const permissionOverwrites = ChannelUtility.getPermissionOverwrites(discordTextChannel);

        const parentId = parent ? parent.id : null;

        return new TextChannel({
            id: discordTextChannel.id,
            name: discordTextChannel.name,
            position: discordTextChannel.position,
            permissionOverwrites: permissionOverwrites,
            parent: parent,
            parentId: parentId,
            guildId: guild.id,
            guild: guild,
            createdAt: new Date()
        })
    }
}