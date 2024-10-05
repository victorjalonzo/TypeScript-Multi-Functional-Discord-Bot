import { ChatInputCommandInteraction } from "discord.js"
import { EmbedResult } from "../../shared/intraestructure/EmbedResult.js";
import { cache } from "../../shared/intraestructure/Cache.js";
import { InlineBlockText } from "../../shared/utils/textFormating.js";
import { IRoleInput } from "../../Role/domain/IRoleInput.js";
import { GuildNotFoundError } from "../../shared/domain/Exceptions.js";
import { ICreditRewardInput } from "../domain/ICreditRewardInput.js";
import { CreditReward } from "../domain/CreditReward.js";
import { IGuildInput } from "../../Guild/domain/IGuildInput.js";
import { CreditRewardIdNotProvidedError, CreditsNotProvidedError, InvitesRequiredNotProvidedError } from "../domain/CreditRewardExceptions.js";

export class CreditRewardCommandActions {
    constructor (
        private service: ICreditRewardInput,
        private guildService: IGuildInput
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
            await interaction.deferReply({ephemeral: true})

            const credits = interaction.options.getInteger('credits')
            const invitesRequired = interaction.options.getInteger('invites')
            const guild = interaction.guild

            if (!guild) throw new GuildNotFoundError()

            const guildRecord = await this.guildService.get(guild.id)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

            if (!credits) throw new CreditsNotProvidedError()
            if (!invitesRequired) throw new InvitesRequiredNotProvidedError()

            const creditReward = new CreditReward({
                credits: credits,
                invitesRequired: invitesRequired,
                guild: guildRecord,
            })

            const result = await this.service.create(creditReward)
            if (!result.isSuccess()) throw result.error

            const rewardCreated = result.value
            
            const title = 'Credit reward created'
            let description = `The credit reward was created successfully.`

            description += InlineBlockText(`Reward Name: ${rewardCreated.name}\nReward ID: ${rewardCreated.id}\nReward Required Invites: ${rewardCreated.invitesRequired}`)
            
            return await EmbedResult.success({title, description, interaction})
        }
        catch (e) {
            return await EmbedResult.fail({description: String(e), interaction})
        }
    }

    delete = async (interaction: ChatInputCommandInteraction) => {
        try {
            await interaction.deferReply({ephemeral: true})

            const creditId = interaction.options.getString('id')
            if (!creditId) throw new CreditRewardIdNotProvidedError()
            
            const guild = interaction.guild
            if (!guild) throw new GuildNotFoundError()

            const result = await this.service.delete(creditId)
            if (!result.isSuccess()) throw result.error

            const rewardDeleted = result.value
            
            const title = 'Credit reward deleted'
            let description = `The role as reward was deleted successfully.`
            description += InlineBlockText(`Reward Name: ${rewardDeleted.name}\nReward ID: (${rewardDeleted.id})\nReward Required Invites: ${rewardDeleted.invitesRequired}`)

            return await EmbedResult.success({title, description, interaction})
        }
        catch (e) {
            return await EmbedResult.fail({description: String(e), interaction})
        }
    }

    list = async (interaction: ChatInputCommandInteraction) => {
        try {
            await interaction.deferReply({ephemeral: true})
            
            const guild = interaction.guild
            if (!guild) throw new GuildNotFoundError()

            const result = await this.service.getAll(guild.id)
            if (!result.isSuccess()) throw result.error

            const creditRewards = result.value

            const title = "Rewards list"
            let description: string

            description = creditRewards.length === 0
            ? InlineBlockText("There are no roles as rewards created")
            : creditRewards.map(creditReward => InlineBlockText(`Reward Name: ${creditReward.name}\nReward ID: (${creditReward.id})\nReward Required Invites: ${creditReward.invitesRequired}`)).join('\n')

            return await EmbedResult.info({title, description, interaction})
        }
        catch (e) {
            return await EmbedResult.fail({description: String(e), interaction})
        }
    }
}