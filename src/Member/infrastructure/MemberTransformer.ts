import {GuildMember} from "discord.js";
import { Member } from "../domain/Member.js";
import { ICachedGuild } from "../../shared/intraestructure/ICachedGuild.js";
import { IGuild } from "../../Guild/domain/IGuild.js";

export class MemberTransformer {
    static parse = (guildMember: GuildMember, guild: IGuild): Member => {
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