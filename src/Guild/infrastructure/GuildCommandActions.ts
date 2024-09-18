import { ChatInputCommandInteraction } from "discord.js"
import { IGuildInput } from "../domain/IGuildInput.js";
import { GuildNotFoundError } from "../../shared/domain/Exceptions.js";
import { logger } from "../../shared/utils/logger.js";
import { IRoleInput } from "../../Role/domain/IRoleInput.js";
import { EmbedResult } from "../../shared/intraestructure/EmbedResult.js";
import { BoldText, InlineBlockText } from "../../shared/utils/textFormating.js";
import { ITextChannelInput } from "../../TextChannel/domain/ITextChannelInput.js";
import { DefaultCreditsNotProvidedError, DefaultInvoiceChannelNotProvidedError, DefaultNotificationChannelNotProvidedError, DefaultRoleNotProvidedError } from "../domain/GuildExceptions.js";

export class GuildCommandActions {
    constructor (
        private service: IGuildInput,
        private roleService: IRoleInput,
        private textChannelService: ITextChannelInput
    ) {}

    execute = async (interaction: ChatInputCommandInteraction) => {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'show-information') {
            return await this.showConfiguration(interaction)
        }
        if (subcommand === 'set-default-credits') {
            return await this.setDefaultCredits(interaction)
        }
        if (subcommand === 'set-default-role') {
            return await this.setDefaultRole(interaction)
        }
        if (subcommand === 'set-default-notification-channel') {
            return await this.setDefaultNotificationChannel(interaction)
        }
        if (subcommand === 'set-default-invoice-channel') {
            return await this.setDefaultInvoiceChannel(interaction)
        }
    }

    showConfiguration = async (interaction: ChatInputCommandInteraction) => {
        try {
            await interaction.deferReply({ ephemeral: true })

            const guild = interaction.guild
            if (!guild) throw new GuildNotFoundError()

            const guildCachedResult = await this.service.get(guild.id)
            if (!guildCachedResult.isSuccess()) throw guildCachedResult.error

            const guildCached = guildCachedResult.value

            const title = 'Guild configuration'

            const defaultCredits = BoldText(`Default credits: `) + InlineBlockText(
                guildCached.defaultCredits + ` Credits`
            )

            const defaultRole = BoldText(`Default role: `) + InlineBlockText(
                guildCached.defaultRole 
                ? `${guildCached.defaultRole.name} (${guildCached.defaultRole.id})` 
                : 'None'
            )

            const defaultNotificationChannel = BoldText(`Default notification channel: `) + InlineBlockText(
                guildCached.defaultNotificationChannel 
                ? `${guildCached.defaultNotificationChannel.name} (${guildCached.defaultNotificationChannel.id})` 
                : 'None'
            )

            const defaultInvoiceChannel = BoldText(`Default invoice channel: `) + InlineBlockText(guildCached.defaultInvoiceChannel
                ? `${guildCached.defaultInvoiceChannel.name} (${guildCached.defaultInvoiceChannel.id})`
                : 'None'
            )
            
            const description = `${defaultCredits}${defaultRole}${defaultNotificationChannel}${defaultInvoiceChannel}`

            const thumbnail = guild.iconURL() ?? undefined

            await EmbedResult.info({title, description, interaction, thumbnail})

            logger.info(`The configuration of the guild ${guild.name} (${guild.id}) was shown`)
        }
        catch (e) {
            await EmbedResult.fail({description: String(e), interaction})
            logger.warn(String(e))
        }
    }

    setDefaultCredits = async (interaction: ChatInputCommandInteraction) => {
        try {
            await interaction.deferReply({ ephemeral: true })

            const guild = interaction.guild
            if (!guild) throw new GuildNotFoundError()

            const credits = interaction.options.getInteger('credits', true)
            if (!credits) throw new DefaultCreditsNotProvidedError()

            const guildCachedResult = await this.service.get(guild.id)
            if (!guildCachedResult.isSuccess()) throw guildCachedResult.error

            const cachedGuild = guildCachedResult.value

            cachedGuild.defaultCredits = credits

            const result = await this.service.update(cachedGuild)
            if (!result.isSuccess()) throw result.error

            const title = 'Credits updated'
            const info = InlineBlockText(`${credits} credits`)
            const description = `The default credits have been updated successfully.` + info

            await EmbedResult.success({title, description, interaction})

            logger.info(`The default credits of the guild ${guild.name} (${guild.id}) was updated`)

        } catch (e) {
            await EmbedResult.fail({description: String(e), interaction})
            logger.warn(String(e))
        }
    }

    setDefaultRole = async (interaction: ChatInputCommandInteraction) => {
        try {
            await interaction.deferReply({ ephemeral: true })

            const guild = interaction.guild
            if (!guild) throw new GuildNotFoundError()

            const role = interaction.options.getRole('role', true)
            if (!role) throw new DefaultRoleNotProvidedError()

            const guildCachedResult = await this.service.get(guild.id)
            if (!guildCachedResult.isSuccess()) throw guildCachedResult.error

            const cachedGuild = guildCachedResult.value

            const roleCachedResult = await this.roleService.get(role.id, guild.id)
            if (!roleCachedResult.isSuccess()) throw roleCachedResult.error

            const cachedRole = roleCachedResult.value

            cachedGuild.defaultRole = cachedRole

            const result = await this.service.update(cachedGuild)
            if (!result.isSuccess()) throw result.error

            const title = 'Role updated'
            const info = InlineBlockText(`${role.name} (${role.id})`)
            const description = `The default role has been updated successfully.` + info

            await EmbedResult.success({title, description, interaction})

            logger.info(`The default role of the guild ${guild.name} (${guild.id}) was updated`)
        }
        catch (e) {
            await EmbedResult.fail({description: InlineBlockText(String(e)), interaction})
            logger.warn(String(e))
        }
    }

    setDefaultNotificationChannel = async (interaction: ChatInputCommandInteraction) => {
        try {
            await interaction.deferReply({ ephemeral: true })

            const guild = interaction.guild
            if (!guild) throw new GuildNotFoundError()

            const channel = interaction.options.getChannel('channel', true)
            if (!channel) throw new DefaultNotificationChannelNotProvidedError()

            const guildCachedResult = await this.service.get(guild.id)
            if (!guildCachedResult.isSuccess()) throw guildCachedResult.error

            const cachedGuild = guildCachedResult.value

            const textChannelCachedResult = await this.textChannelService.get(channel.id, guild.id)
            if (!textChannelCachedResult.isSuccess()) throw textChannelCachedResult.error

            const textChannelCached = textChannelCachedResult.value

            cachedGuild.defaultNotificationChannel = textChannelCached

            const result = await this.service.update(cachedGuild)
            if (!result.isSuccess()) throw result.error

            const title = 'Notification channel updated'
            const info = InlineBlockText(`${channel.name} (${channel.id})`)
            const description = `The default notification channel has been updated successfully.` + info

            await EmbedResult.success({title, description, interaction})

            logger.info(`The default notification channel of the guild ${guild.name} (${guild.id}) was updated`)
        }
        catch (e) {
            await EmbedResult.fail({description: InlineBlockText(String(e)), interaction})
            logger.warn(String(e))
        }
    }

    setDefaultInvoiceChannel = async (interaction: ChatInputCommandInteraction) => {
        try {
            await interaction.deferReply({ ephemeral: true })

            const guild = interaction.guild
            if (!guild) throw new GuildNotFoundError()

            const channel = interaction.options.getChannel('channel', true)
            if (!channel) throw new DefaultInvoiceChannelNotProvidedError()

            const guildCachedResult = await this.service.get(guild.id)
            if (!guildCachedResult.isSuccess()) throw guildCachedResult.error

            const guildCached = guildCachedResult.value

            const textChannelCachedResult = await this.textChannelService.get(channel.id, guild.id)
            if (!textChannelCachedResult.isSuccess()) throw textChannelCachedResult.error

            const textChannelCached = textChannelCachedResult.value

            guildCached.defaultInvoiceChannel = textChannelCached

            const result = await this.service.update(guildCached)
            if (!result.isSuccess()) throw result.error

            const title = 'Invoice channel updated'
            const info = InlineBlockText(`${channel.name} (${channel.id})`)
            const description = `The default invoice channel has been updated successfully.` + info

            await EmbedResult.success({title, description, interaction})

            logger.info(`The default invoice channel of the guild ${guild.name} (${guild.id}) was updated`)
        }
        catch (e) {
            await EmbedResult.fail({description: InlineBlockText(String(e)), interaction})
            logger.warn(String(e))
        }
    }
}