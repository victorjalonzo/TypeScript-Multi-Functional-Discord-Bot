import { Role } from "discord.js"
import { IRoleRecordInput } from "../domain/IRoleRecordInput.js";
import { RoleRecordTransformer } from "./RoleRecordTransformer.js";
import { logger } from "../../shared/utils/logger.js";

export class RoleRecordEventController {
    constructor (private service: IRoleRecordInput) {}

    create = async (role: Role) => {
        try {
            const roleRecord = RoleRecordTransformer.parse(role)
            const result = await this.service.create(roleRecord)

            if (!result.isSuccess()) throw result.error

            const roleRecordCreated = result.value

            logger.info(`The role ${roleRecordCreated.name} (${roleRecordCreated.id}) was created`)
        }
        catch (e) {
            logger.warn(e)
        }
    }
    update = async (oldRole: Role, newRole: Role) => {
        try {
            const oldRoleRecord = RoleRecordTransformer.parse(oldRole)
            const newRoleRecord = RoleRecordTransformer.parse(newRole)

            const result = await this.service.update(newRoleRecord)
            if (!result.isSuccess()) throw result.error

            const roleRecordUpdated = result.value

            logger.info(`The role ${roleRecordUpdated.name} (${roleRecordUpdated.id}) was updated`)
        }
        catch (e) {
            logger.warn(e)
        }
    }

    delete = async (role: Role) => {
        try {
            const guild = role.guild
            const result = await this.service.delete(role.id, guild.id)

            if (!result.isSuccess()) throw result.error

            const roleRecordDeleted = result.value
            logger.info(`The role ${roleRecordDeleted.name} (${roleRecordDeleted.id}) was deleted`)
        }
        catch (e) {
            logger.warn(e)
        }
    }
}