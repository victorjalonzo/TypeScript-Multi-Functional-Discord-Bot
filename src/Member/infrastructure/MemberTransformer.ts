import {GuildMember} from "discord.js";
import { Member } from "../domain/Member.js";
import { IGuild } from "../../Guild/domain/IGuild.js";

export class MemberTransformer {
    static parse = (guildMember: GuildMember, guild: IGuild): Member => {
        try {
            return new Member({
                id: guildMember.id,
                username: guildMember.user.username,
                discriminator: guildMember.user.discriminator,
                guild: guild,
                avatarURL: guildMember.user.avatarURL() ?? undefined
            })
        }
        catch (e) {
            throw new Error(String(e))
        }
    }
}