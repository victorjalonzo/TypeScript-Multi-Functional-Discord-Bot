import { logger } from "../../shared/utils/logger.js";
import { IRoleProductInput } from "../domain/IRoleProductInput.js";
import { Role } from "discord.js"
import { Guild } from "discord.js";

export class RoleProductEventController {
    constructor (private service: IRoleProductInput) {}

    refresh = async (guild: Guild) => {
        try {
            const roles = guild.roles.cache.size > 0 
            ? guild.roles.cache.map(role => role) 
            : (await guild.roles.fetch()).map(role => role);

            const result = await this.service.getAll(guild.id)
            if (!result.isSuccess()) throw result.error

            if (result.value.length === 0) return logger.info(`There are no obsolete role products in the guild ${guild.id}`)
    
            const roleProductsObsolete = result.value.filter(roleProduct => 
                roles.some(role => 
                    role.id !== roleProduct.id
                )
            )

            if (roleProductsObsolete.length > 0) {
                for (const roleProduct of roleProductsObsolete) {
                    await this.service.delete(roleProduct.id)
                    logger.info(`The obsolete role product ${roleProduct.id} was deleted`)
                }
            }
        }
        catch (e) {
            logger.warn(e)
        }
    }

    delete = async (role: Role) => {
        try {
            const result = await this.service.delete(role.id)
            if (!result.isSuccess()) return

            logger.info(`The role product ${role.id} was deleted`)
        }
        catch (e) {
            logger.warn(e)
        }
    }
}