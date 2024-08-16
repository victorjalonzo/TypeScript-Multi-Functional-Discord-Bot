import { VoiceChannel as DiscordVoiceChannel } from "discord.js"
import { IVoiceChannel } from "../domain/IVoiceChannel.js"
import { VoiceChannel } from "../domain/VoiceChannel.js"
import { VoiceChannelTransformationError } from "../domain/VoiceChannelExceptions.js"
import { cache } from "../../shared/intraestructure/Cache.js"
import { ChannelUtility } from "../../shared/utils/ChannelUtility.js"
import { CachedGuildNotFoundError } from "../../shared/domain/CachedGuildException.js"

export class VoiceChannelTransformer {
    static parse = (voiceChannel: DiscordVoiceChannel): IVoiceChannel => {
        try {
            const {
                id, name, position, bitrate, rtcRegion, parentId, guildId, permissionsLocked, 
                joinable, manageable, rateLimitPerUser, createdAt 
            } = voiceChannel

            const cachedGuild = cache.get(voiceChannel.guild.id);
            if (!cachedGuild) throw new CachedGuildNotFoundError();

            const permissionOverwrites = ChannelUtility.getPermissionOverwrites(voiceChannel)
    
            return new VoiceChannel(
                id, name, position, bitrate, joinable, manageable, permissionOverwrites, 
                permissionsLocked, rateLimitPerUser, rtcRegion, parentId, 
                guildId, cachedGuild, createdAt
            )
        }
        catch(e) {
            throw new VoiceChannelTransformationError(String(e))
        }
    }
}