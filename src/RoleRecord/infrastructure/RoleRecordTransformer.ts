import {Role} from "discord.js"
import { IRoleRecord } from "../domain/IRoleRecord.js";
import { RoleRecord } from "../domain/RoleRecord.js";
import { cache } from "../../shared/intraestructure/Cache.js";

export class RoleRecordTransformer {
    static parse = (role: Role): IRoleRecord => {
        const {id, name, position, color} = role
        const cachedGuild = cache.get(role.guild.id)

        if (!cachedGuild) throw new Error("The guild was not found in the cache.")

        return new RoleRecord(id, name, position, color, cachedGuild.id, cachedGuild)
    }
}