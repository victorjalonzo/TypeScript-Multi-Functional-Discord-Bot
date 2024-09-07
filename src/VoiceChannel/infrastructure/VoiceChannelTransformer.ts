import { VoiceChannel as DiscordVoiceChannel } from "discord.js"
import { IVoiceChannel } from "../domain/IVoiceChannel.js"
import { VoiceChannel } from "../domain/VoiceChannel.js"
import { VoiceChannelTransformationError } from "../domain/VoiceChannelExceptions.js"
import { ChannelUtility } from "../../shared/utils/ChannelUtility.js"
import { ICategoryChannel } from "../../CategoryChannel/domain/ICategoryChannel.js"
import { IGuild } from "../../Guild/domain/IGuild.js"

export class VoiceChannelTransformer {
    static parse = ({discordVoiceChannel, parent, guild}: {discordVoiceChannel: DiscordVoiceChannel, parent: ICategoryChannel | null, guild: IGuild}): IVoiceChannel => {
        try {
            const permissionOverwrites = ChannelUtility.getPermissionOverwrites(discordVoiceChannel)

            return new VoiceChannel ({
                id: discordVoiceChannel.id,
                name: discordVoiceChannel.name,
                position: discordVoiceChannel.rawPosition,
                bitrate: discordVoiceChannel.bitrate,
                joinable: discordVoiceChannel.joinable,
                manageable: discordVoiceChannel.manageable,
                permissionOverwrites: permissionOverwrites,
                permissionsLocked: discordVoiceChannel.permissionsLocked,
                rateLimitPerUser: discordVoiceChannel.rateLimitPerUser ?? undefined,
                rtcRegion: discordVoiceChannel.rtcRegion ?? undefined,
                parent: parent,
                parentId: parent?.id ?? null,
                guildId: guild.id,
                guild: guild,
                createdAt: new Date()
            })
        }
        catch(e) {
            throw new VoiceChannelTransformationError(String(e))
        }
    }
}