import {Role as DiscordRole} from "discord.js"
import { IRole } from "../domain/IRole.js";
import { Role } from "../domain/Role.js";
import { IGuild } from "../../Guild/domain/IGuild.js";

export class RoleTransformer {
    static parse = (role: DiscordRole, guild: IGuild): IRole => {

        const permissions = role.permissions.toArray()

        return new Role({
            id: role.id,
            name: role.name,
            position: role.position,
            color: role.color,
            permissions,
            hoist: role.hoist,
            mentionable: role.mentionable,
            managed: role.managed,
            editable: role.editable,
            guildId: role.guild.id,
            guild: guild
        })
    }
}