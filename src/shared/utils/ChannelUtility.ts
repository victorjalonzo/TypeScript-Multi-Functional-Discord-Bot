import { PermissionOverwrite } from "../domain/IPermissionOverwrite.js"
import { TextChannel as DiscordTextChannel } from "discord.js"
import { VoiceChannel as DiscordVoiceChannel } from "discord.js"
import { CategoryChannel as DiscordCategoryChannel } from "discord.js"

type DiscordChannelType = DiscordTextChannel | DiscordVoiceChannel | DiscordCategoryChannel

export class ChannelUtility {
    static getPermissionOverwrites(channel: DiscordChannelType): PermissionOverwrite[] | [] {
        let overwrites: PermissionOverwrite[] | []

        overwrites = channel.permissionOverwrites.cache.map(overwrite => {
            return {
                id: overwrite.id,
                allow: overwrite.allow.toArray(),
                deny: overwrite.deny.toArray()
            }
        })

        return overwrites
    }
}