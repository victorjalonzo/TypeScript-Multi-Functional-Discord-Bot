import {GuildMember} from "discord.js";
import { Member } from "../domain/Member.js";
import { ICachedGuild } from "../../shared/intraestructure/ICachedGuild.js";

export class MemberTransformer {
    static parse = (guildMember: GuildMember, guild: ICachedGuild): Member => {
        try {
            const { id } = guildMember;
            const { username, discriminator } = guildMember.user
            const avatarURL = guildMember.user.avatarURL();

            return new Member(id, username, discriminator, guild.id, guild, avatarURL);
        }
        catch (e) {
            throw new Error(String(e))
        }
    }
}