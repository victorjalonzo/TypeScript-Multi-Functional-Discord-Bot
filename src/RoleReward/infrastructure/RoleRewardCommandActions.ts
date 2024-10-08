import { IRoleRewardInput } from "../domain/IRoleRewardInput.js"
import { ChatInputCommandInteraction } from "discord.js"
import { EmbedResult } from "../../shared/intraestructure/EmbedResult.js";
import { RoleReward } from "../domain/RoleReward.js";
import { cache } from "../../shared/intraestructure/Cache.js";
import { InlineBlockText } from "../../shared/utils/textFormating.js";
import { IRoleInput } from "../../Role/domain/IRoleInput.js";
import { GuildNotFoundError } from "../../shared/domain/Exceptions.js";

export class RoleRewardCommandActions {
    constructor (
        private service: IRoleRewardInput,
        private roleService: IRoleInput
    ) {}

    execute = async (interaction: ChatInputCommandInteraction) => {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'list') return await this.list(interaction)
        if (subcommand === 'create') return await this.create(interaction)
        if (subcommand === 'delete') return await this.delete(interaction)

        throw new Error(`Unknow subcommand ${subcommand}`)
    }

    create = async (interaction: ChatInputCommandInteraction) => {
        try {
            const role = interaction.options.getRole('role')
            const invites = interaction.options.getInteger('invites')
            const guild = interaction.guild

            if (!guild) throw new GuildNotFoundError()

            const cachedGuild = cache.get(guild.id)
            if (!cachedGuild) throw new GuildNotFoundError()

            if (!role) throw new Error("The role was not found")
            if (!invites) throw new Error("The amount was not found")

            const roleCachedResult = await this.roleService.get(role.id, guild.id)
            if (!roleCachedResult.isSuccess()) throw roleCachedResult.error

            const roleCached = roleCachedResult.value

            const reward = new RoleReward({
                id: role.id,
                role: roleCached,
                invitesRequired: invites,
                guildId: guild.id,
                guild: cachedGuild,
            })

            const result = await this.service.create(reward)
            if (!result.isSuccess()) throw result.error

            const rewardCreated = result.value
            
            const title = 'Reward created'
            let description = `The role as reward was created successfully.`
            description += InlineBlockText(`Reward Name: ${rewardCreated.role.name}\nReward ID: (${rewardCreated.role.id})\nReward Required Invites: ${rewardCreated.invitesRequired}`)
            
            return await EmbedResult.success({title, description, interaction})
        }
        catch (e) {
            return await EmbedResult.fail({description: String(e), interaction})
        }
    }

    delete = async (interaction: ChatInputCommandInteraction) => {
        try {
            const role = interaction.options.getRole('role')
            if (!role) throw new Error("The role was not found")
            
            const guild = interaction.guild
            if (!guild) throw new GuildNotFoundError()

            const result = await this.service.delete(role.id, guild.id)
            if (!result.isSuccess()) throw result.error

            const reward = result.value
            
            const title = 'Reward deleted'
            let description = `The role as reward was deleted successfully.`
            description += InlineBlockText(`Reward Name: ${reward.role.name}\nReward ID: (${reward.role.id})\nReward Required Invites: ${reward.invitesRequired}`)

            return await EmbedResult.success({title, description, interaction})
        }
        catch (e) {
            return await EmbedResult.fail({description: String(e), interaction})
        }
    }

    list = async (interaction: ChatInputCommandInteraction) => {
        try {
            const guild = interaction.guild
            if (!guild) throw new GuildNotFoundError()

            const result = await this.service.getAll(guild.id)
            if (!result.isSuccess()) throw result.error

            const rewards = result.value

            const title = "Rewards list"
            let description: string

            description = rewards.length === 0
            ? InlineBlockText("There are no roles as rewards created")
            : rewards.map(reward => InlineBlockText(`Reward Name: ${reward.role.name}\nReward ID: (${reward.role.id})\nReward Required Invites: ${reward.invitesRequired}`)).join('\n')

            return await EmbedResult.info({title, description, interaction})
        }
        catch (e) {
            return await EmbedResult.fail({description: String(e), interaction})
        }
    }
}