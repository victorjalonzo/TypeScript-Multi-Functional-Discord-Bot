import { 
    CategoryChannel as DiscordCategoryChannel, 
    Role as DiscordRole, 
    TextChannel as DiscordTextChannel,
    VoiceChannel as DiscordVoiceChannel, 
    Guild as DiscordGuild,
    GuildMember as DiscordGuildMember,
    ChannelType, 
    ChatInputCommandInteraction, 
    Message, 
    PermissionsBitField, 
} from "discord.js";

import { IBackupInput } from "../domain/IBackupInput.js";
import { BotMemberNotFoundError, BotMissingPermissionsError, GuildNotFoundError } from "../../shared/domain/Exceptions.js";
import { IGuildInput } from "../../Guild/domain/IGuildInput.js";
import { Backup } from "../domain/Backup.js";
import { BackupAlreadyExistsError, BackupNameRequiredError } from "../domain/BackupExceptions.js";
import { EmbedResult } from "../../shared/intraestructure/EmbedResult.js";
import { logger } from "../../shared/utils/logger.js";
import { IRoleInput } from "../../Role/domain/IRoleInput.js";
import { ITextChannelInput } from "../../TextChannel/domain/ITextChannelInput.js";
import { IVoiceChannelInput } from "../../VoiceChannel/domain/IVoiceChannelInput.js";
import { ICategoryChannelInput } from "../../CategoryChannel/domain/ICategoryChannelInput.js";
import { PermissionOverwrite } from "../../shared/domain/IPermissionOverwrite.js";
import { TextChannelModel } from "../../TextChannel/infrastructure/TextChannelSchema.js";
import { VoiceChannelModel } from "../../VoiceChannel/infrastructure/VoiceChannelSchema.js";
import { IRoleProductInput } from "../../RoleProduct/domain/IRoleProductInput.js";
import { RoleProduct } from "../../RoleProduct/domain/RoleProduct.js";
import { IRewardRoleInput } from "../../RewardRole/domain/IRewardRoleInput.js";
import { RewardRole } from "../../RewardRole/domain/RewardRole.js";
import { ICasualPaymentInput } from "../../CasualPayment/domain/ICasualPaymentInput.js";
import { CasualPayment } from "../../CasualPayment/domain/CasualPayment.js";
import { IPaypointInput } from "../../PaypointRole/domain/IPaypointInput.js";
import { IMemberInput } from "../../Member/domain/IMemberInput.js";
import { Member } from "../../Member/domain/Member.js";
import { Paypoint } from "../../PaypointRole/domain/Paypoint.js";
import { createGuildMenuEmbed } from "../../PaypointRole/infrastructure/Embeds/GuildMenuEmbed.js";
import { getAttachmentFromBuffer } from "../../shared/utils/AttachmentBuffer.js";
import { MemberAlreadyExistsError } from "../../Member/domain/MemberExceptions.js";
import { IPaypoint } from "../../PaypointRole/domain/IPaypointRole.js";
import { PaypointDeletionError, PaypointNotFoundError } from "../../PaypointRole/domain/PaypointExceptions.js";
import { IRole } from "../../Role/domain/IRole.js";
import { ICategoryChannel } from "../../CategoryChannel/domain/ICategoryChannel.js";
import { ITextChannel } from "../../TextChannel/domain/ITextChannel.js";
import { IVoiceChannel } from "../../VoiceChannel/domain/IVoiceChannel.js";
import { IMember } from "../../Member/domain/IMember.js";
import { IGuild } from "../../Guild/domain/IGuild.js";
import { IRoleProduct } from "../../RoleProduct/domain/IRoleProduct.js";
import { IRewardRole } from "../../RewardRole/domain/IRewardRole.js";
import { ICasualPayment } from "../../CasualPayment/domain/ICasualPayment.js";

export class BackupCommandAction {
    constructor (
        private service: IBackupInput,
        private guildService: IGuildInput,
        private roleService: IRoleInput,
        private textChannelService: ITextChannelInput,
        private voiceChannelService: IVoiceChannelInput,
        private categoryChannelService: ICategoryChannelInput,
        private memberService: IMemberInput,
        private roleProductService: IRoleProductInput,
        private rewardRoleService: IRewardRoleInput,
        private casualPaymentService: ICasualPaymentInput,
        private paypointRoleService: IPaypointInput
    ) {}

    execute = async (interaction: ChatInputCommandInteraction) => {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'create') return await this.create(interaction)
        if (subcommand === 'load') return await this.load(interaction)
        if (subcommand === 'list') return await this.list(interaction)
        if (subcommand === 'delete') return await this.delete(interaction)
    }

    load = async (interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply();

        try {
            const guild = interaction.guild
            const name = interaction.options.getString('name')

            if (!guild) throw new GuildNotFoundError()
            if (!name) throw new BackupNameRequiredError()

            const botMember = guild.members.me; 
            if (!botMember) throw new BotMemberNotFoundError()
            
            if (!botMember.permissions.has(PermissionsBitField.Flags.Administrator)) {
                throw new BotMissingPermissionsError()
            }

            const guildCachedResult = await this.guildService.get(guild.id)
            if (!guildCachedResult.isSuccess()) throw guildCachedResult.error

            const guildCached = guildCachedResult.value

            const result = await this.service.get(name)
            if (!result.isSuccess()) throw result.error

            const backup = result.value

            const currentRoles = await guild.roles.fetch()

            for (const role of currentRoles.values()) {
                if (role.name === '@everyone' && role.position === 0) continue
                if (role.managed) continue

                const roleDeleted = await role.delete()
                logger.info(`The current role ${roleDeleted.name} (${roleDeleted.id}) was deleted`)   
            }

            const currentChannels = await guild.channels.fetch()

            for (const channel of currentChannels.values()) {
                if (!channel) continue
                if (channel == interaction.channel) continue

                const channelDeleted = await channel.delete()
                logger.info(`The current channel ${channelDeleted.name} (${channelDeleted.id}) was deleted`)
            }

            await this._deleteCurrentAddOns(guild)

            const rolesLastReference: Record<string, DiscordRole> = await this._retrieveRoles(backup.guildId, guild)

            const categoriesLastReference: Record<string, any> = await this._retrieveCategoryChannels(backup.guildId, guild, rolesLastReference)
            const textChannelsLastReference: Record<string, DiscordTextChannel> = await this._retrieveTextAndVoiceChannels(backup.guildId, guild, categoriesLastReference, rolesLastReference)
            
            const membersRetrieved: IMember[] = await this._retrieveMembers(backup.guildId, guildCached)
            const roleProductsRetrieved: IRoleProduct[] = await this._retrieveRoleProducts(backup.guildId, guildCached, rolesLastReference)
            const roleRewardsRetrieved: RewardRole[] = await this._retrieveRoleRewards(backup.guildId, guildCached, rolesLastReference)
            const casualPaymentMethodsRetrieved: ICasualPayment[] = await this._retrieveCasualPaymentMethods(backup.guildId, guildCached)
            const paypointRetrieved: IPaypoint | undefined = await this._retrievePaypoint(backup.guildId, guildCached, textChannelsLastReference)

            logger.info(`Roles retrieved: ${Object.keys(rolesLastReference).length}`)
            logger.info(`Categories retrieved: ${Object.keys(categoriesLastReference).length}`)
            logger.info(`Members retrieved: ${membersRetrieved.length}`)
            logger.info(`Role products retrieved: ${roleProductsRetrieved.length}`)
            logger.info(`Role rewards retrieved: ${roleRewardsRetrieved.length}`)
            logger.info(`Casual payments retrieved: ${casualPaymentMethodsRetrieved.length}`)
            logger.info(`Paypoint retrieved: ${paypointRetrieved ? 'true' : 'false'}`)

            await EmbedResult.success({
                title: 'Backup loaded',
                description: `The backup ${backup.name} was loaded`,
                interaction: interaction
            })
        }
        catch (e) {
            await EmbedResult.fail({
                title: 'Failed to load backup',
                description: String(e),
                interaction: interaction
            })
            logger.info(e)
        }
    }

    _deleteCurrentAddOns = async (guild: DiscordGuild): Promise<void> => {
        const rewardRolesRemovedResult = await this.rewardRoleService.deleteAll(guild.id)
        if (!rewardRolesRemovedResult.isSuccess()) throw rewardRolesRemovedResult.error

        const roleProductsRemovedResult = await this.roleProductService.deleteAll(guild.id)
        if (!roleProductsRemovedResult.isSuccess()) throw roleProductsRemovedResult.error

        const casualPaymentMethodsRemovedResult = await this.casualPaymentService.deleteAll(guild.id)
        if (!casualPaymentMethodsRemovedResult.isSuccess()) throw casualPaymentMethodsRemovedResult.error

        const paypointRemovedResult = await this.paypointRoleService.delete(guild.id)
        if (!paypointRemovedResult.isSuccess() && !(paypointRemovedResult.error instanceof PaypointDeletionError)) throw paypointRemovedResult.error
    }

    _retrieveRoles = async (backupGuildId: string, guild: DiscordGuild): Promise<Record<string, DiscordRole>> => {
        const rolesResult = await this.roleService.getAll(backupGuildId)
        if (!rolesResult.isSuccess()) throw rolesResult.error

        const roles = rolesResult.value
        
        const lastReference: Record<string, DiscordRole> = {}

        roles.sort((a, b) => a.position - b.position)

        for (const role of roles) {
            try {
                let newRole: DiscordRole

                if (role.name == '@everyone' && role.position == 0) {
                    newRole = await guild.roles.everyone.edit({
                        permissions: new PermissionsBitField(<any>role.permissions)
                    })
                }
                else {
                    newRole = await guild.roles.create({
                        name: role.name,
                        color: role.color,
                        position: role.position,
                        hoist: role.hoist,
                        mentionable: role.mentionable,
                        permissions: new PermissionsBitField(<any>role.permissions)
                    })
                }
                lastReference[role.id] = newRole
                logger.info(`The role ${newRole.name} (${newRole.id}) was restored`)
            }
            catch (e) {
                continue
            }
        }
        return lastReference
    }

    _retrieveCategoryChannels = async (backupGuildId: string, guild: DiscordGuild, rolesLastReference: Record<string, DiscordRole>): Promise<Record<string, DiscordCategoryChannel>> => {
        const categoryChannelsResult = await this.categoryChannelService.getAll(backupGuildId)
        if (!categoryChannelsResult.isSuccess()) throw categoryChannelsResult.error

        const categoryChannels = categoryChannelsResult.value
        
        const lastReference: Record<string, DiscordCategoryChannel> = {}

        for (const categoryChannel of categoryChannels) {
            const permissionOverwrites = this._getUpdatedPermissionOverwrites(categoryChannel.permissionOverwrites, rolesLastReference)

            const newCategory = await guild.channels.create({
                name: categoryChannel.name,
                type: ChannelType.GuildCategory,
                position: categoryChannel.position,
                permissionOverwrites: <any>permissionOverwrites
            })

            lastReference[categoryChannel.id] = newCategory

            logger.info(`The category ${newCategory.name} (${newCategory.id}) was restored`)
        }

        return lastReference

    }

    _retrieveTextAndVoiceChannels = async (backupGuildId: string, guild: DiscordGuild, categoryLastReference: Record<string, DiscordCategoryChannel>, rolesLastReference: Record<string, DiscordRole>): Promise<Record<string, DiscordTextChannel>> => {
        const textChannelsResult = await this.textChannelService.getAll(backupGuildId)
        if (!textChannelsResult.isSuccess()) throw textChannelsResult.error

        const voiceChannelsResult = await this.voiceChannelService.getAll(backupGuildId)
        if (!voiceChannelsResult.isSuccess()) throw voiceChannelsResult.error

        const textChannels = textChannelsResult.value
        const voiceChannels = voiceChannelsResult.value

        const channels = <ITextChannel[] & IVoiceChannel[]> [...textChannels, ...voiceChannels]
        
        const lastReference: Record<string, DiscordTextChannel> = {}
        channels.sort((a, b) => a.position - b.position)

        for (const channel of channels) {
            const permissionOverwrites = this._getUpdatedPermissionOverwrites(channel.permissionOverwrites, rolesLastReference)
            
            const category = channel.parentId ? categoryLastReference[channel.parentId] : undefined

            if (channel instanceof TextChannelModel) {
                const newTextChannel = await guild.channels.create({
                    name: channel.name,
                    type: ChannelType.GuildText,
                    position: channel.position,
                    parent: category,
                    permissionOverwrites: <any>permissionOverwrites
                })

                lastReference[channel.id] = newTextChannel

                logger.info(`The text channel ${newTextChannel.name} (${newTextChannel.id}) was restored`)
            }

            if (channel instanceof VoiceChannelModel) {
                const newVoiceChannel = await guild.channels.create({
                    name: channel.name,
                    type: ChannelType.GuildVoice,
                    position: channel.position,
                    bitrate: channel.bitrate,
                    rateLimitPerUser: channel.rateLimitPerUser,
                    rtcRegion: channel.rtcRegion,
                    parent: category,
                    permissionOverwrites: <any>permissionOverwrites
                })
                logger.info(`The voice channel ${newVoiceChannel.name} (${newVoiceChannel.id}) was restored`)
            }
        }

        return lastReference
    }

    _retrieveMembers = async (backupGuildId: string, guildCached: IGuild): Promise<IMember[]> => {
        const membersResult = await this.memberService.getAll(backupGuildId)
        if (!membersResult.isSuccess()) throw membersResult.error

        const members = membersResult.value

        const membersRetrieved: IMember[] = []

        for (const member of members) {
            const newMember = new Member({
                id: member.id,
                username: member.username,
                discriminator: member.discriminator,
                avatarURL: member.avatarURL,
                invitedBy: member.invitedBy,
                guild: guildCached,
                guildId: guildCached.id
            })

            const result = await this.memberService.create(newMember)

            if (!result.isSuccess()) {
                if (result.error instanceof MemberAlreadyExistsError) continue
                throw result.error
            }

            const memberCreated = result.value
            membersRetrieved.push(memberCreated)

            logger.info(`Member ${memberCreated.username} (${memberCreated.id}) was restored`)
        }
        return membersRetrieved
    }

    _retrieveRoleProducts = async (backupGuildId: string, guildCached: IGuild, rolesLastReference: Record<string, DiscordRole>): Promise<IRoleProduct[]> => {
        const roleProductsResult = await this.roleProductService.getAll(backupGuildId)
        if (!roleProductsResult.isSuccess()) throw roleProductsResult.error

        const roleProducts = roleProductsResult.value
        
        const roleProductsRetrieved: IRoleProduct[] = []

        for (const roleProduct of roleProducts) {
            const role = rolesLastReference[roleProduct.id]

            const roleCachedResult = await this.roleService.get(role.id, guildCached.id)
            if (!roleCachedResult.isSuccess()) continue

            const newRoleProduct = new RoleProduct({
                id: role.id,
                role: roleCachedResult.value,
                guild: guildCached,
                guildId: guildCached.id,
                price: roleProduct.price,
            })

            const result = await this.roleProductService.create(newRoleProduct)
            if (!result.isSuccess()) throw result.error

            const roleProductCreated = result.value
            roleProductsRetrieved.push(roleProductCreated)

            logger.info(`The role product ${roleProduct.role.name} (${roleProduct.id}) was restored`)
        }

        return roleProductsRetrieved
    }

    _retrieveRoleRewards = async (backupGuildId: string, guildCached: IGuild, rolesLastReference: Record<string, DiscordRole>): Promise<IRewardRole[]> => {
        const roleRewardsResult = await this.rewardRoleService.getAll(backupGuildId)
        if (!roleRewardsResult.isSuccess()) throw roleRewardsResult.error

        const roleRewards = roleRewardsResult.value
        
        const roleRewardsRetrieved: IRewardRole[] = []

        for (const roleReward of roleRewards) {
            const role = rolesLastReference[roleReward.id]

            const roleCachedResult = await this.roleService.get(role.id, guildCached.id)
            if (!roleCachedResult.isSuccess()) continue

            const newRoleReward = new RewardRole({
                id: role.id,
                role: roleCachedResult.value,
                invites: roleReward.invites,
                guild: guildCached,
                guildId: guildCached.id
            })

            const result = await this.rewardRoleService.create(newRoleReward)
            if (!result.isSuccess()) throw result.error

            const roleRewardCreated = result.value
            roleRewardsRetrieved.push(roleRewardCreated)

            logger.info(`The reward role ${roleRewardCreated.id} (${roleRewardCreated.invites} invites) was restored`)
        }
        return roleRewardsRetrieved

    }

    _retrieveCasualPaymentMethods = async (backupGuildId: string, guildCached: IGuild): Promise<ICasualPayment[]> => {
        const casualPaymentsResult = await this.casualPaymentService.getAll(backupGuildId)
        if (!casualPaymentsResult.isSuccess()) throw casualPaymentsResult.error

        const casualPaymentMethods = casualPaymentsResult.value

        const casualPaymentMethodsRetrieved: ICasualPayment[] = []

        for (const casualPaymentMethod of casualPaymentMethods) {
            const newCasualPayment = new CasualPayment({
                name: casualPaymentMethod.name,
                value: casualPaymentMethod.value,
                guild: guildCached,
                guildId: guildCached.id
            })

            const result = await this.casualPaymentService.create(newCasualPayment)
            if (!result.isSuccess()) throw result.error

            const casualPaymentCreated = result.value
            casualPaymentMethodsRetrieved.push(casualPaymentCreated)

            logger.info(`The casual payment ${casualPaymentCreated.name} (${casualPaymentCreated.value}) was restored`)
        }
        return casualPaymentMethodsRetrieved
    }

    _retrievePaypoint = async (backupGuildId: string, guildCached: IGuild, textChannelsLastReference: Record<string, DiscordTextChannel>): Promise<IPaypoint | undefined> => {
        const paypointResult = await this.paypointRoleService.get(backupGuildId)
        
        if (!paypointResult.isSuccess()) {
            if (paypointResult.error instanceof PaypointNotFoundError) return
            
            throw paypointResult.error
        }

        const paypoint = paypointResult.value

        const createPaypointOnTextChannel = async (): Promise<undefined> => {
            if (!paypoint.channelId) return 

            const textChannelReference = textChannelsLastReference[paypoint.channelId]
            if (!textChannelReference) return

            paypoint.channelId = textChannelReference.id

            const roleProductsResult = await this.roleProductService.getAll(backupGuildId)
            if (!roleProductsResult.isSuccess()) return

            const roleProducts = roleProductsResult.value
            if (roleProducts.length === 0) return

            const casualPaymentMethodsResult = await this.casualPaymentService.getAll(backupGuildId)
            if (!casualPaymentMethodsResult.isSuccess()) return

            const casualPaymentMethods = casualPaymentMethodsResult.value
            if (casualPaymentMethods.length === 0) return

            const media = paypoint.media ? await getAttachmentFromBuffer(paypoint.media) : undefined

            const { embed, selectRow, files } = await createGuildMenuEmbed({
                title: paypoint.title, 
                description: paypoint.description,
                media: media,
                products: roleProducts,
                casualPaymentMethods: casualPaymentMethods
            })
            const message = await textChannelReference.send({
                embeds: [embed], 
                components: [<any>selectRow], 
                files: files
            })
            paypoint.messageId = message.id
        }

        await createPaypointOnTextChannel()

        const newPaypointRole = new Paypoint({
            title: paypoint.title,
            description: paypoint.description,
            media: paypoint.media,
            mediaCodec: paypoint.mediaCodec,
            paymentMethod: paypoint.paymentMethod,
            messageId: paypoint.messageId,
            channelId: paypoint.channelId,
            guild: guildCached,
            guildId: guildCached.id
        })

        const paypointRoleCreationResult = await this.paypointRoleService.create(newPaypointRole)
        if (!paypointRoleCreationResult.isSuccess()) throw paypointRoleCreationResult.error

        const paypointRoleCreated = paypointRoleCreationResult.value
        logger.info(`The paypoint role ${paypointRoleCreated.title} was retrieved successfully`)
    }

    _getUpdatedPermissionOverwrites = (overwrites: PermissionOverwrite[], rolesLastReference: Record<string, DiscordRole>): PermissionOverwrite[] => {
        const newOverwrites: PermissionOverwrite[] = []

        for (const overwrite of overwrites) {
            const newRole = rolesLastReference[overwrite.id]
            if (!newRole) continue

            overwrite.id = newRole.id
            newOverwrites.push(overwrite)
        }
        return newOverwrites
    }

    list = async (interaction: ChatInputCommandInteraction) => {
        try {
            const guild = interaction.guild

            if (!guild) throw new GuildNotFoundError()

            const guildResult = await this.guildService.get(guild.id)
            if (!guildResult.isSuccess()) throw guildResult.error

            const cachedGuild = guildResult.value

            const result = await this.service.getAll(cachedGuild.id)
            if (!result.isSuccess()) throw result.error

            const backups = result.value

            let description: string

            description = backups.length === 0
                ? 'There are no backups'
                : '' + backups
                    .map(backup => `${backup.name.toUpperCase()} : ${backup.createdBy.toUpperCase()}`)
                    .join('\n')

            await EmbedResult.success({
                title: 'Backup list',
                description: description,
                thumbnail: 'success',
                interaction: interaction
            })

        }
        catch (e) {
            await EmbedResult.fail({
                title: 'Failed to get backup list',
                description: String(e),
                thumbnail: 'error',
                interaction: interaction
            })
        }
    }

    create = async (interaction: ChatInputCommandInteraction) => {
        try {
            const guild = interaction.guild
            const name = interaction.options.getString('name')
    
            if (!guild) throw new GuildNotFoundError()
            if (!name) throw new BackupNameRequiredError()
            
            const guildResult = await this.guildService.get(guild.id)
            if (!guildResult.isSuccess()) throw guildResult.error
    
            const cachedGuild = guildResult.value
    
            const backupResult = await this.service.get(name)
            if (backupResult.isSuccess()) throw new BackupAlreadyExistsError()
    
            const backup = new Backup({
                name: name,
                guildId: guild.id,
                guild: cachedGuild,
                createdBy: interaction.user.id,
            })
    
            const result = await this.service.create(backup)
            if (!result.isSuccess()) throw result.error
    
            await EmbedResult.success({
                title: 'Backup created',
                description: `Backup ${name} created successfully`,
                interaction: interaction
            })
        }
        catch (e) {
            await EmbedResult.fail({
                title: 'Failed to create backup',
                description: (e as Error).message,
                interaction: interaction
            })
        }
    }

    delete = async (interaction: ChatInputCommandInteraction) => {
        try {
            const name = interaction.options.getString('name')

            if (!name) throw new BackupNameRequiredError()

            const result = await this.service.delete(name)
            if (!result.isSuccess()) throw result.error

            await EmbedResult.success({
                title: 'Backup deleted',
                description: `Backup ${name} deleted successfully`,
                thumbnail: 'success',
                interaction: interaction
            })
        }
        catch (e) {
            await EmbedResult.fail({
                title: 'Failed to delete backup',
                description: (e as Error).message,
                thumbnail: 'failed',
                interaction: interaction
            })
        }
    }
}