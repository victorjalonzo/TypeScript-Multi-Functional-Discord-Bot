import {Role as DiscordRole} from "discord.js"
import { IRole } from "../domain/IRole.js";
import { Role } from "../domain/Role.js";
import { cache } from "../../shared/intraestructure/Cache.js";
import { CachedGuildNotFoundError } from "../../shared/domain/CachedGuildException.js";

export class RoleTransformer {
    static parse = (role: DiscordRole): IRole => {
        const {id, name, position, color, mentionable, hoist, editable, managed} = role
        const cachedGuild = cache.get(role.guild.id)

        if (!cachedGuild) throw new CachedGuildNotFoundError();

        const permissions = role.permissions.toJSON()

        return new Role(id, name, position, color, permissions, hoist, 
            mentionable, managed, editable,  cachedGuild.id, cachedGuild
        )
    }
}