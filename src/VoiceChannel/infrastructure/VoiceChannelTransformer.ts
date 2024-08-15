import { VoiceChannel as DiscordVoiceChannel } from "discord.js"
import { IVoiceChannel } from "../domain/IVoiceChannel.js"
import { VoiceChannel } from "../domain/VoiceChannel.js"
import { VoiceChannelTransformationError } from "../domain/VoiceChannelExceptions.js"
import { cache } from "../../shared/intraestructure/Cache.js"
import { Channel } from "../../shared/intraestructure/Channel.js"

export class VoiceChannelTransformer {
    static parse = (voiceChannel: DiscordVoiceChannel): IVoiceChannel => {
        try {
            const {
                id, name, position, bitrate, rtcRegion, parentId, guildId, permissionsLocked, 
                joinable, manageable, rateLimitPerUser, createdAt 
            } = voiceChannel

            const cachedGuild = cache.get(voiceChannel.guild.id);

            if (!cachedGuild) throw new Error("The cached guild was not found")

            const permissionOverwrites = Channel.getPermissionOverwrites(voiceChannel)
    
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