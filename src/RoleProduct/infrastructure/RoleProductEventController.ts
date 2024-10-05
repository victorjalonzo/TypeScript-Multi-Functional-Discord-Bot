import { logger } from "../../shared/utils/logger.js";
import { IRoleProductInput } from "../domain/IRoleProductInput.js";
import { Role } from "discord.js"
import { Guild } from "discord.js";

export class RoleProductEventController {
    constructor (private service: IRoleProductInput) {}

    refresh = async (guild: Guild, roles: Role[]) => {
        try {
            const roleProducts = await this.service.getAll(guild.id)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

            const roleProductsObsolete = roleProducts.filter(roleProduct => {
                return !roles.some(role => role.id === roleProduct.id)
            })

            for (const roleProduct of roleProductsObsolete) {
                const roleProductDeletedResult = await this.service.delete(roleProduct.id)
                if (!roleProductDeletedResult.isSuccess()) throw roleProductDeletedResult.error
            }

            logger.info("role products: up to date.")
        }
        catch (e) {
            logger.warn(`role products: not up to date. Something went wrong: ${String(e)}`)
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