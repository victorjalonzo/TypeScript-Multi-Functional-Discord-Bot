import {GuildMember} from "discord.js";
import { Member } from "../domain/Member.js";
import { ICachedGuild } from "../../shared/intraestructure/ICachedGuild.js";

export class MemberTransformer {
    static parse = (guildMember: GuildMember, guild: ICachedGuild): Member => {
        try {
            return new Member({
                id: guildMember.id,
                username: guildMember.user.username,
                discriminator: guildMember.user.discriminator,
                guildId: guild.id,
                guild: guild,
                avatarURL: guildMember.user.avatarURL()
            })
        }
        catch (e) {
            throw new Error(String(e))
        }
    }
}