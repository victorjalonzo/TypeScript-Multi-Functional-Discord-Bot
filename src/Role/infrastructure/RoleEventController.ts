import { Guild as DiscordGuild, Role as DiscordRole } from "discord.js"
import { IRoleInput } from "../domain/IRoleInput.js";
import { RoleTransformer } from "./RoleTransformer.js";
import { logger } from "../../shared/utils/logger.js";
import { RoleUpdateError } from "../domain/RoleException.js";
import { IGuildInput } from "../../Guild/domain/IGuildInput.js";
import { IRole } from "../domain/IRole.js";
import { IGuild } from "../../Guild/domain/IGuild.js";
import { Result } from "../../shared/domain/Result.js";
import { refreshLog } from "../../shared/utils/RefreshLog.js";
import { GuildHasNoRoles } from "../../Guild/domain/GuildExceptions.js";

export class RoleEventController {
    constructor (
        private service: IRoleInput,
        private guildService: IGuildInput
    ) {}

    refresh = async (guild: DiscordGuild) => {
        const rolesCreated: IRole[] = []
        const rolesUpdated: IRole[] = []
        const rolesDeleted: IRole[] = []

        try {
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

            if (roles.length === 0) throw new GuildHasNoRoles()

            const rolesRefreshed: IRole[] = []

            for (const role of roles) {
                if (role.managed) continue
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
        }
        catch (e) {
            if (!(e instanceof GuildHasNoRoles)) {
                logger.warn(e)
            }
        }
        refreshLog({
            itemsAdded: rolesCreated.length,
            itemsUpdated: rolesUpdated.length,
            itemsRemoved: rolesDeleted.length,
            singular: "role",
            plural: "roles"
        })
    }

    create = async (role: DiscordRole) => {
        try {
            if (role.managed) return

            const guildRecord = await this.guildService.get(role.guild.id)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

            const roleParsed = RoleTransformer.parse(role, guildRecord)
            
            const roleCreated = await this.service.create(roleParsed)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

            logger.info(`Role ${roleCreated.name} (${roleCreated.id}) was created`)
        }
        catch (e) {
            logger.warn(e)
        }
    }
    update = async (oldRole: DiscordRole, newRole: DiscordRole) => {
        try {
            if (oldRole.managed) return

            const guildRecord = await this.guildService.get(newRole.guild.id)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

            const newRoleParsed = RoleTransformer.parse(newRole, guildRecord)

            const roleUpdated = await this.service.update(newRoleParsed)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

            logger.info(`Role ${roleUpdated.name} (${roleUpdated.id}) was updated`)
        }
        catch (e) {
            if (e instanceof RoleUpdateError) return await this.create(newRole)
            logger.warn(e)
        }
    }

    delete = async (role: DiscordRole) => {
        try {
            if (role.managed) return

            const guild = role.guild
            const roleDeleted = await this.service.delete(role.id, guild.id)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

            logger.info(`Role ${roleDeleted.name} (${roleDeleted.id}) was deleted`)
        }
        catch (e) {
            logger.warn(e)
        }
    }
}