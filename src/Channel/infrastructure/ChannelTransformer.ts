import { Channel } from "../domain/Channel.js";
import { TextChannel, VoiceChannel, CategoryChannel } from "discord.js";

type ChannelType = TextChannel | VoiceChannel | CategoryChannel;

export class ChannelTransformer {
    static parse(incomeChannel: ChannelType): Channel {
        const { name, id, type, position, permissionOverwrites, createdAt, parentId, guildId } = incomeChannel;

        const permissionOverwritesMap: Map<string, any> = permissionOverwrites.valueOf();
        const PermissionOverwritesList: Record<string, any>[] = [];

        permissionOverwritesMap.forEach((value, key) => {
            PermissionOverwritesList.push({ id: key, type: value.type, allow: value.allow, deny: value.deny });
        });

        return new Channel(name, id, type, position, PermissionOverwritesList, createdAt, parentId, guildId);
    }
}