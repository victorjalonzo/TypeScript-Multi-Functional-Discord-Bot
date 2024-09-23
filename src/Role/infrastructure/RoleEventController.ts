import { Guild as DiscordGuild, Role as DiscordRole } from "discord.js"
import { IRoleInput } from "../domain/IRoleInput.js";
import { RoleTransformer } from "./RoleTransformer.js";
import { logger } from "../../shared/utils/logger.js";
import { RoleUpdateError } from "../domain/RoleException.js";
import { IGuildInput } from "../../Guild/domain/IGuildInput.js";
import { IRole } from "../domain/IRole.js";
import { IGuild } from "../../Guild/domain/IGuild.js";
import { Result } from "../../shared/domain/Result.js";
import { printRoleRefreshStatus } from "../domain/RoleFreshStatus.js";

export class RoleEventController {
    constructor (
        private service: IRoleInput,
        private guildService: IGuildInput
    ) {}

    refresh = async (guild: DiscordGuild) => {
        try {
            const rolesCreated: IRole[] = []
            const rolesUpdated: IRole[] = []
            const rolesDeleted: IRole[] = []

            const [guildCachedResult, rolesCachedResult] = await Promise.all([
                this.guildService.get(guild.id),
                this.service.getAll(guild.id)
            ]);

            if (!guildCachedResult.isSuccess() || !rolesCachedResult.isSuccess()) {
                throw guildCachedResult.error || rolesCachedResult.error;
            }

            const guildCached = guildCachedResult.value as IGuild;
            const rolesCached = rolesCachedResult.value as IRole[];

            let roles: DiscordRole[]

            try {
                roles = (await guild.roles.fetch()).map(role => role)
            }
            catch(e) {
                throw new Error(`Error fetching roles: ${String(e)}`)
            }

            if (roles.length === 0) return printRoleRefreshStatus({
                    rolesCreated: rolesCreated.length, 
                    rolesUpdated: rolesUpdated.length, 
                    rolesDeleted: rolesDeleted.length
                })

            const rolesRefreshed: IRole[] = []

            for (const role of roles) {
                const match = rolesCached.find(r => r.id === role.id)

                const roleParsed: IRole = RoleTransformer.parse(role, guildCached)

                let result: Result<IRole>
                
                if (match) {
                    result = await this.service.update(roleParsed)
                    if (!result.isSuccess()) throw result.error

                    rolesUpdated.push(result.value)
                }
                else {
                    result = await this.service.create(roleParsed)
                    if (!result.isSuccess()) throw result.error

                    rolesCreated.push(result.value)
                }

                rolesRefreshed.push(result.value)
            }

            const roleObsoletes = rolesCached.filter(roleCached => {
                return !rolesRefreshed.some(roleRefreshed => roleRefreshed.id === roleCached.id)
            })

            for (const roleObsolete of roleObsoletes) {
                const result = await this.service.delete(roleObsolete.id, guild.id)
                if (!result.isSuccess()) throw result.error

                rolesDeleted.push(roleObsolete)
            }
            
            printRoleRefreshStatus({
                rolesCreated: rolesCreated.length, 
                rolesUpdated: rolesUpdated.length, 
                rolesDeleted: rolesDeleted.length
            })
        }
        catch (e) {
            logger.warn(e)
        }
    }

    create = async (role: DiscordRole) => {
        try {
            const guildCachedResult = await this.guildService.get(role.guild.id)
            if (!guildCachedResult.isSuccess()) throw guildCachedResult.error

            const guildCached = guildCachedResult.value

            const roleParsed = RoleTransformer.parse(role, guildCached)
            
            const result = await this.service.create(roleParsed)
            if (!result.isSuccess()) throw result.error

            const roleCreated = result.value

            logger.info(`Role ${roleCreated.name} (${roleCreated.id}) was created`)
        }
        catch (e) {
            logger.warn(e)
        }
    }
    update = async (oldRole: DiscordRole, newRole: DiscordRole) => {
        try {
            const guildCachedResult = await this.guildService.get(newRole.guild.id)
            if (!guildCachedResult.isSuccess()) throw guildCachedResult.error

            const guildCached = guildCachedResult.value

            const newRoleParsed = RoleTransformer.parse(newRole, guildCached)

            const result = await this.service.update(newRoleParsed)
            if (!result.isSuccess()) throw result.error

            const roleUpdated = result.value

            logger.info(`Role ${roleUpdated.name} (${roleUpdated.id}) was updated`)
        }
        catch (e) {
            if (e instanceof RoleUpdateError) return await this.create(newRole)
            logger.warn(e)
        }
    }

    delete = async (role: DiscordRole) => {
        try {
            const guild = role.guild
            const result = await this.service.delete(role.id, guild.id)

            if (!result.isSuccess()) throw result.error

            const roleDeleted = result.value
            logger.info(`Role ${roleDeleted.name} (${roleDeleted.id}) was deleted`)
        }
        catch (e) {
            logger.warn(e)
        }
    }
}