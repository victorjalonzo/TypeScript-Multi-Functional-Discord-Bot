import { IRewardRoleInput } from "../domain/IRewardRoleInput.js"
import { ChatInputCommandInteraction } from "discord.js"
import { EmbedResult } from "../../shared/intraestructure/EmbedResult.js";
import { RewardRole } from "../domain/RewardRole.js";
import { cache } from "../../shared/intraestructure/Cache.js";
import { InlineBlockText } from "../../shared/utils/textFormating.js";

export class RewardRoleCommandActions {
    constructor (private service: IRewardRoleInput) {}

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

            if (!guild) throw new Error("The guild was not found")
            const cachedGuild = cache.get(guild.id)

            if (!cachedGuild) throw new Error("The guild was not found")

            if (!role) throw new Error("The role was not found")
            if (!invites) throw new Error("The amount was not found")

            const reward = new RewardRole(role.id, invites, guild.id, cachedGuild)

            const result = await this.service.create(reward)

            if (!result.isSuccess()) throw new Error(result.error)
            
            const description = InlineBlockText(`The reward role ${role.name} (${reward.id}) was created`)
            
            return await EmbedResult.success({description, interaction})
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
            if (!guild) throw new Error("The guild was not found")

            const result = await this.service.delete(role.id, guild.id)
            if (!result.isSuccess()) throw new Error(result.error)
            
            const description = InlineBlockText(`The reward role ${role.name} (${role.id}) was deleted`)

            return await EmbedResult.success({description, interaction})
        }
        catch (e) {
            return await EmbedResult.fail({description: String(e), interaction})
        }
    }

    list = async (interaction: ChatInputCommandInteraction) => {
        try {
            const guild = interaction.guild
            if (!guild) throw new Error("The guild was not found")

            const cachedGuild = cache.get(guild.id)
            if (!cachedGuild) throw new Error("The guild was not found")

            const result = await this.service.getAll(guild.id)
            if (!result.isSuccess()) throw new Error(result.error)

            const rewards = result.value
            if (!rewards) throw new Error("The rewards were not found")

            let description = ""
            
            if (rewards.length === 0) {
                description = InlineBlockText("The list currently is empty.")
            }
            else {
                for (const reward of rewards) {
                    const role = await guild.roles.fetch(reward.roleId)
                    if (!role) continue

                    description += `${role.name} : ${reward.invites}\n`
                }
                description = InlineBlockText(description)
            }

            return await EmbedResult.info({description, interaction})
        }
        catch (e) {
            return await EmbedResult.fail({description: String(e), interaction})
        }
    }
}