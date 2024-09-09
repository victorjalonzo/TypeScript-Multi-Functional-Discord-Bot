import { Role } from "discord.js"
import { IRoleInput } from "../domain/IRoleInput.js";
import { RoleTransformer } from "./RoleTransformer.js";
import { logger } from "../../shared/utils/logger.js";
import { RoleUpdateError } from "../domain/RoleException.js";

export class RoleEventController {
    constructor (private service: IRoleInput) {}

    create = async (role: Role) => {
        try {
            const roleParsed = RoleTransformer.parse(role)
            
            const result = await this.service.create(roleParsed)
            if (!result.isSuccess()) throw result.error

            const roleCreated = result.value

            logger.info(`The role ${roleCreated.name} (${roleCreated.id}) was created`)
        }
        catch (e) {
            logger.warn(e)
        }
    }
    update = async (oldRole: Role, newRole: Role) => {
        try {
            const oldRoleParsed = RoleTransformer.parse(oldRole)
            const newRoleParsed = RoleTransformer.parse(newRole)

            const result = await this.service.update(newRoleParsed)
            if (!result.isSuccess()) throw result.error

            const roleUpdated = result.value

            logger.info(`The role ${roleUpdated.name} (${roleUpdated.id}) was updated`)
        }
        catch (e) {
            if (e instanceof RoleUpdateError) return await this.create(newRole)
            logger.warn(e)
        }
    }

    delete = async (role: Role) => {
        try {
            const guild = role.guild
            const result = await this.service.delete(role.id, guild.id)

            if (!result.isSuccess()) throw result.error

            const roleDeleted = result.value
            logger.info(`The role ${roleDeleted.name} (${roleDeleted.id}) was deleted`)
        }
        catch (e) {
            logger.warn(e)
        }
    }
}