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
import { BackupAlreadyExistsError, BackupNameRequiredError, BackupNotFoundError } from "../domain/BackupExceptions.js";
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
import { IRoleRewardInput } from "../../RoleReward/domain/IRoleRewardInput.js";
import { RoleReward } from "../../RoleReward/domain/RoleReward.js";
import { ICasualPaymentInput } from "../../CasualPayment/domain/ICasualPaymentInput.js";
import { CasualPayment } from "../../CasualPayment/domain/CasualPayment.js";
import { IPaypointInput } from "../../Paypoint/domain/IPaypointInput.js";
import { IMemberInput } from "../../Member/domain/IMemberInput.js";
import { Member } from "../../Member/domain/Member.js";
import { Paypoint } from "../../Paypoint/domain/Paypoint.js";
import { createGuildMenuEmbed } from "../../Paypoint/infrastructure/Embeds/GuildMenuEmbed.js";
import { getAttachmentFromBuffer } from "../../shared/utils/AttachmentBuffer.js";
import { MemberAlreadyExistsError } from "../../Member/domain/MemberExceptions.js";
import { IPaypoint } from "../../Paypoint/domain/IPaypoint.js";
import { PaypointDeletionError, PaypointNotFoundError } from "../../Paypoint/domain/PaypointExceptions.js";
import { IRole } from "../../Role/domain/IRole.js";
import { ICategoryChannel } from "../../CategoryChannel/domain/ICategoryChannel.js";
import { ITextChannel } from "../../TextChannel/domain/ITextChannel.js";
import { IVoiceChannel } from "../../VoiceChannel/domain/IVoiceChannel.js";
import { IMember } from "../../Member/domain/IMember.js";
import { IGuild } from "../../Guild/domain/IGuild.js";
import { IRoleProduct } from "../../RoleProduct/domain/IRoleProduct.js";
import { IRoleReward } from "../../RoleReward/domain/IRoleReward.js";
import { ICasualPayment } from "../../CasualPayment/domain/ICasualPayment.js";
import { ICreditProductInput } from "../../CreditProduct/domain/ICreditProductInput.js";
import { ICreditProduct } from "../../CreditProduct/domain/ICreditProduct.js";
import { PaypointMessage } from "../../Paypoint/infrastructure/PaypointMessage.js";
import { ICreditWalletInput } from "../../CreditWallet/domain/ICreditWalletInput.js";
import { ICreditRewardInput } from "../../CreditReward/domain/ICreditRewardInput.js";
import { ICreditChannelLockerInput } from "../../CreditChannelLocker/domain/ICreditChannelLockerInput.js";
import { IInvitePointInput } from "../../InvitePoint/domain/IInvitePointInput.js";
import { CreditWallet } from "../../CreditWallet/domain/CreditWallet.js";
import { ICreditWallet } from "../../CreditWallet/domain/ICreditWallet.js";
import { CreditProduct } from "../../CreditProduct/domain/CreditProduct.js";
import { ICreditReward } from "../../CreditReward/domain/ICreditReward.js";
import { CreditReward } from "../../CreditReward/domain/CreditReward.js";
import { InvitePoint } from "../../InvitePoint/domain/InvitePoint.js";
import { InvitePointMessage } from "../../InvitePoint/infrastructure/InvitePointMessage.js";
import { IInvitePoint } from "../../InvitePoint/domain/IInvitePoint.js";
import { InvitePointNotFoundError } from "../../InvitePoint/domain/InvitePointExceptions.js";
import { ICreditChannelLocker } from "../../CreditChannelLocker/domain/ICreditChannelLock.js";
import { CreditChannelLockerMessage } from "../../CreditChannelLocker/infraestructure/CreditChannelLockerMessage.js";
import { CreditChannelLocker } from "../../CreditChannelLocker/domain/CreditChannelLocker.js";
import { InlineBlockText } from "../../shared/utils/textFormating.js";

export class BackupCommandAction {
    constructor (
        private service: IBackupInput,
        private guildService: IGuildInput,
        private roleService: IRoleInput,
        private textChannelService: ITextChannelInput,
        private voiceChannelService: IVoiceChannelInput,
        private categoryChannelService: ICategoryChannelInput,
        private memberService: IMemberInput,
        private creditChannelLockerService: ICreditChannelLockerInput,
        private roleProductService: IRoleProductInput,
        private roleRewardService: IRoleRewardInput,
        private creditWalletService: ICreditWalletInput,
        private creditProductService: ICreditProductInput,
        private creditRewardService: ICreditRewardInput,
        private casualPaymentMethodService: ICasualPaymentInput,
        private invitePointService: IInvitePointInput,
        private payPointService: IPaypointInput
    ) {}

    execute = async (interaction: ChatInputCommandInteraction) => {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'create') return await this.create(interaction)
        if (subcommand === 'load') return await this.load(interaction)
        if (subcommand === 'list') return await this.list(interaction)
        if (subcommand === 'remove') return await this.delete(interaction)
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

            const guildRecord = await this.guildService.get(guild.id)
            .then(result => result.isSuccess() ? result.value : Promise.reject(result.error))

            const backup = await this.service.get(name)
            .then(result => result.isSuccess() ? result.value : Promise.reject(result.error))

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
            const membersRetrieved: IMember[] = await this._retrieveMembers(backup.guildId, guildRecord)
            const creditChannelLockersRetrieved: ICreditChannelLocker[] = await this._retrieveCreditChannelLockers(backup.guildId, guildRecord, textChannelsLastReference)
            const roleProductsRetrieved: IRoleProduct[] = await this._retrieveRoleProducts(backup.guildId, guildRecord, rolesLastReference)
            const roleRewardsRetrieved: RoleReward[] = await this._retrieveRoleRewards(backup.guildId, guildRecord, rolesLastReference)
            const casualPaymentMethodsRetrieved: ICasualPayment[] = await this._retrieveCasualPaymentMethods(backup.guildId, guildRecord)
            const creditWalletsRetrieved: ICreditWallet[] = await this._retrieveCreditWallets(backup.guildId, guildRecord)
            const creditProductsRetrieved: ICreditProduct[] = await this._retrieveCreditProducts(backup.guildId, guildRecord)
            const creditRewardsRetrieved: ICreditReward[] = await this._retrieveCreditRewards(backup.guildId, guildRecord)
            const invitePointRetrieved: IInvitePoint | undefined = await this._retrieveInvitePoint(backup.guildId, guildRecord, textChannelsLastReference)
            const paypointRetrieved: IPaypoint | undefined = await this._retrievePaypoint(backup.guildId, guildRecord, textChannelsLastReference)

            logger.info(`Roles retrieved: ${Object.keys(rolesLastReference).length}`)
            logger.info(`Categories retrieved: ${Object.keys(categoriesLastReference).length}`)
            logger.info(`Members retrieved: ${membersRetrieved.length}`)
            logger.info(`Credit channel lockers retrieved: ${creditChannelLockersRetrieved.length}`)
            logger.info(`Role products retrieved: ${roleProductsRetrieved.length}`)
            logger.info(`Role rewards retrieved: ${roleRewardsRetrieved.length}`)
            logger.info(`Casual payment methods retrieved: ${casualPaymentMethodsRetrieved.length}`)
            logger.info(`Credit wallets retrieved: ${creditWalletsRetrieved.length}`)
            logger.info(`Credit products retrieved: ${creditProductsRetrieved.length}`)
            logger.info(`Credit rewards retrieved: ${creditRewardsRetrieved.length}`)
            logger.info(invitePointRetrieved ? `Invite point retrieved` : `No Invite point retrieved`)
            logger.info(paypointRetrieved ? `Paypoint retrieved` : `No Paypoint retrieved`)

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

    _deleteCurrentAddOns = async (guild: DiscordGuild): Promise<Record<string, any>> => {
        const result = await Promise.all([
            this.roleRewardService.deleteAll(guild.id),
            this.roleProductService.deleteAll(guild.id),
            this.creditWalletService.deleteAll(guild.id),
            this.creditProductService.deleteAll(guild.id),
            this.creditRewardService.deleteAll(guild.id),
            this.casualPaymentMethodService.deleteAll(guild.id),
            this.creditChannelLockerService.deleteAll(guild.id)
        ])

        result.forEach(r => !r.isSuccess() ? Promise.reject(r.error) : null)

        const [
            roleRewardsDeleted, 
            roleProductsDeleted, 
            creditWalletsDeleted, 
            creditProductsDeleted, 
            creditRewardsDeleted, 
            casualPaymentMethodsDeleted,
            channelLockersDeleted
        ] = result

        const payPointDeleted = await this.payPointService.delete(guild.id)
        .then(r => {
            if (r.isSuccess()) return r.value
            if (!r.isSuccess() && r.error instanceof PaypointNotFoundError) return null
            return Promise.reject(r.error)
        })

        const invitePointDeleted = await this.invitePointService.delete(guild.id)
        .then(r => {
            if (r.isSuccess()) return r.value
            if (!r.isSuccess() && r.error instanceof InvitePointNotFoundError) return null
            return Promise.reject(r.error)
        })

        return {
            roleRewardsDeleted,
            roleProductsDeleted,
            creditWalletsDeleted,
            creditProductsDeleted,
            creditRewardsDeleted,
            casualPaymentMethodsDeleted,
            payPointDeleted,
            invitePointDeleted,
            channelLockersDeleted
        }

    }

    _retrieveRoles = async (backupGuildId: string, guild: DiscordGuild): Promise<Record<string, DiscordRole>> => {
        const roleRecords = await this.roleService.getAll(backupGuildId)
        .then(result => result.isSuccess() ? result.value : Promise.reject(result.error))
        
        const lastReference: Record<string, DiscordRole> = {}

        roleRecords.sort((a, b) => a.position - b.position)

        for (const roleRecord of roleRecords) {
            try {
                let role: DiscordRole

                if (roleRecord.name == '@everyone' && roleRecord.position == 0) {
                    role = await guild.roles.everyone.edit({
                        permissions: new PermissionsBitField(<any>roleRecord.permissions)
                    })
                }
                else {
                    role = await guild.roles.create({
                        name: roleRecord.name,
                        color: roleRecord.color,
                        position: roleRecord.position,
                        hoist: roleRecord.hoist,
                        mentionable: roleRecord.mentionable,
                        permissions: new PermissionsBitField(<any>roleRecord.permissions)
                    })
                }
                lastReference[roleRecord.id] = role
                logger.info(`The role ${role.name} (${role.id}) was restored`)
            }
            catch (e) {
                continue
            }
        }
        return lastReference
    }

    _retrieveCategoryChannels = async (
        backupGuildId: string, 
        guild: DiscordGuild, 
        rolesLastReference: Record<string, DiscordRole>
    ): Promise<Record<string, DiscordCategoryChannel>> => {
        const categoryChannelRecords = await this.categoryChannelService.getAll(backupGuildId)
        .then(result => result.isSuccess() ? result.value : Promise.reject(result.error))
        
        const lastReference: Record<string, DiscordCategoryChannel> = {}

        for (const categoryChannelRecord of categoryChannelRecords) {
            const permissionOverwrites = this._getUpdatedPermissionOverwrites(categoryChannelRecord.permissionOverwrites, rolesLastReference)

            const categoryChannel: DiscordCategoryChannel = await guild.channels.create({
                name: categoryChannelRecord.name,
                type: ChannelType.GuildCategory,
                position: categoryChannelRecord.position,
                permissionOverwrites: <any>permissionOverwrites
            })

            lastReference[categoryChannelRecord.id] = categoryChannel

            logger.info(`The category ${categoryChannel.name} (${categoryChannel.id}) was restored`)
        }

        return lastReference

    }

    _retrieveTextAndVoiceChannels = async (
        backupGuildId: string, 
        guild: DiscordGuild, 
        categoryLastReference: Record<string, DiscordCategoryChannel>, 
        rolesLastReference: Record<string, DiscordRole>
    ): Promise<Record<string, DiscordTextChannel>> => {
        const textChannelRecords = await this.textChannelService.getAll(backupGuildId)
        .then(result => result.isSuccess() ? result.value : Promise.reject(result.error))

        const voiceChannelRecords = await this.voiceChannelService.getAll(backupGuildId)
        .then(result => result.isSuccess() ? result.value : Promise.reject(result.error))

        const channelRecords = <ITextChannel[] & IVoiceChannel[]> [...textChannelRecords, ...voiceChannelRecords]
        
        const lastReference: Record<string, DiscordTextChannel> = {}
        channelRecords.sort((a, b) => a.position - b.position)

        for (const channelRecord of channelRecords) {
            const permissionOverwrites = this._getUpdatedPermissionOverwrites(channelRecord.permissionOverwrites, rolesLastReference)
            
            const category: DiscordCategoryChannel | undefined = channelRecord.parentId ? categoryLastReference[channelRecord.parentId] : undefined

            if (channelRecord instanceof TextChannelModel) {
                const textChannel: DiscordTextChannel = await guild.channels.create({
                    name: channelRecord.name,
                    type: ChannelType.GuildText,
                    position: channelRecord.position,
                    parent: category,
                    permissionOverwrites: <any>permissionOverwrites
                })

                lastReference[channelRecord.id] = textChannel

                logger.info(`The text channel ${textChannel.name} (${textChannel.id}) was restored`)
            }

            if (channelRecord instanceof VoiceChannelModel) {
                const voiceChannel: DiscordVoiceChannel = await guild.channels.create({
                    name: channelRecord.name,
                    type: ChannelType.GuildVoice,
                    position: channelRecord.position,
                    bitrate: channelRecord.bitrate,
                    rateLimitPerUser: channelRecord.rateLimitPerUser,
                    rtcRegion: channelRecord.rtcRegion,
                    parent: category,
                    permissionOverwrites: <any>permissionOverwrites
                })
                logger.info(`The voice channel ${voiceChannel.name} (${voiceChannel.id}) was restored`)
            }
        }

        return lastReference
    }

    _retrieveMembers = async (backupGuildId: string, guildRecord: IGuild): Promise<IMember[]> => {
        const memberRecords = await this.memberService.getAll(backupGuildId)
        .then(result => result.isSuccess() ? result.value : Promise.reject(result.error))

        const membersRetrieved: IMember[] = []

        for (const memberRecord of memberRecords) {
            const member: IMember = new Member({
                id: memberRecord.id,
                username: memberRecord.username,
                discriminator: memberRecord.discriminator,
                avatarURL: memberRecord.avatarURL,
                invitedBy: memberRecord.invitedBy,
                guild: guildRecord
            })

            const result = await this.memberService.create(member)

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

    _retrieveCreditChannelLockers = async (backupGuildId: string, guildRecord: IGuild, channelLastReference: Record<string, DiscordTextChannel>): Promise<ICreditChannelLocker[]> => {
        const creditChannelLockerRecords = await this.creditChannelLockerService.getAll(backupGuildId)
        .then(result => result.isSuccess() ? result.value : Promise.reject(result.error))

        const creditChannelLockersRetrieved: ICreditChannelLocker[] = []

        for (const channelLockerRecord of creditChannelLockerRecords) {
            const lockedChannel = channelLastReference[channelLockerRecord.id]
            const sourceChannel = channelLastReference[channelLockerRecord.sourceChannelId]
            
            if (!lockedChannel || !sourceChannel) continue
            
            const creditChannelLocker = new CreditChannelLocker({
                id: lockedChannel.id,
                sourceChannelId: sourceChannel.id,
                price: channelLockerRecord.price,
                description: channelLockerRecord.description,
                media: channelLockerRecord.media,
                mediaCodec: channelLockerRecord.mediaCodec,
                guild: guildRecord,
            })

            const creditChannelLockerCreated = await this.creditChannelLockerService.create(creditChannelLocker)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

            await CreditChannelLockerMessage.create({
                service: this.creditChannelLockerService,
                channel: lockedChannel
            })

            creditChannelLockersRetrieved.push(creditChannelLockerCreated)
        }

        return creditChannelLockersRetrieved
    }

    _retrieveRoleProducts = async (backupGuildId: string, guildRecord: IGuild, rolesLastReference: Record<string, DiscordRole>): Promise<IRoleProduct[]> => {
        const roleProducts = await this.roleProductService.getAll(backupGuildId)
        .then(result => result.isSuccess() ? result.value : Promise.reject(result.error))
        
        const roleProductsRetrieved: IRoleProduct[] = []

        for (const roleProduct of roleProducts) {
            const role = rolesLastReference[roleProduct.id]

            const roleRecordResult = await this.roleService.get(role.id, guildRecord.id)
            if (!roleRecordResult.isSuccess()) continue

            const newRoleProduct = new RoleProduct({
                role: roleRecordResult.value,
                guild: guildRecord,
                price: roleProduct.price,
            })

            const roleProductCreated = await this.roleProductService.create(newRoleProduct)
            .then(result => result.isSuccess() ? result.value : Promise.reject(result.error))

            roleProductsRetrieved.push(roleProductCreated)

            logger.info(`The role product ${roleProduct.role.name} (${roleProduct.id}) was restored`)
        }

        return roleProductsRetrieved
    }

    _retrieveRoleRewards = async (backupGuildId: string, guildRecord: IGuild, rolesLastReference: Record<string, DiscordRole>): Promise<IRoleReward[]> => {
        const roleRewards = await this.roleRewardService.getAll(backupGuildId)
        .then(result => result.isSuccess() ? result.value : Promise.reject(result.error))
        
        const roleRewardsRetrieved: IRoleReward[] = []

        for (const roleReward of roleRewards) {
            const role = rolesLastReference[roleReward.id]

            const roleRecordResult = await this.roleService.get(role.id, guildRecord.id)
            if (!roleRecordResult.isSuccess()) continue

            const newRoleReward = new RoleReward({
                id: role.id,
                role: roleRecordResult.value,
                invitesRequired: roleReward.invitesRequired,
                guild: guildRecord,
                guildId: guildRecord.id
            })

            const roleRewardCreated = await this.roleRewardService.create(newRoleReward)
            .then(result => result.isSuccess() ? result.value : Promise.reject(result.error))

            roleRewardsRetrieved.push(roleRewardCreated)

            logger.info(`The reward role ${roleRewardCreated.id} (${roleRewardCreated.invitesRequired} invites) was restored`)
        }
        return roleRewardsRetrieved

    }

    _retrieveCasualPaymentMethods = async (backupGuildId: string, guildRecord: IGuild): Promise<ICasualPayment[]> => {
        const casualPaymentMethods = await this.casualPaymentMethodService.getAll(backupGuildId)
        .then(result => result.isSuccess() ? result.value : Promise.reject(result.error))

        const casualPaymentMethodsRetrieved: ICasualPayment[] = []

        for (const casualPaymentMethod of casualPaymentMethods) {
            const newCasualPaymentMethod = new CasualPayment({
                name: casualPaymentMethod.name,
                value: casualPaymentMethod.value,
                guild: guildRecord,
                guildId: guildRecord.id
            })

            const casualPaymentMethodCreated = await this.casualPaymentMethodService.create(newCasualPaymentMethod)
            .then(result => result.isSuccess() ? result.value : Promise.reject(result.error))

            casualPaymentMethodsRetrieved.push(casualPaymentMethodCreated)

            logger.info(`The casual payment method ${casualPaymentMethodCreated.name} (${casualPaymentMethodCreated.value}) was restored`)
        }
        return casualPaymentMethodsRetrieved
    }

    _retrievePaypoint = async (backupGuildId: string, guildRecord: IGuild, textChannelsLastReference: Record<string, DiscordTextChannel>): Promise<IPaypoint | undefined> => {
        const payPointRecord = await this.payPointService.get(backupGuildId)
        .then(r => {
            if (!r.isSuccess() && !(r.error instanceof PaypointNotFoundError)) return Promise.reject(r.error) 
            return r.value
        })

        if (!payPointRecord) return

        const paypoint = new Paypoint({
            guild: guildRecord,
            guildId: guildRecord.id,
            title: payPointRecord.title,
            description: payPointRecord.description,
            media: payPointRecord.media,
            mediaCodec: payPointRecord.mediaCodec,
            productType: payPointRecord.productType,
            paymentMethod: payPointRecord.paymentMethod
        })

        const paypointCreated = await this.payPointService.create(paypoint)
        .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

        if (payPointRecord.channelId && payPointRecord.messageId) {
            const textChannel = textChannelsLastReference[payPointRecord.channelId]
            
            if (textChannel) await PaypointMessage.create({
                guildId: guildRecord.id,
                channel: textChannel,
                service: this.payPointService,
                roleProductService: this.roleProductService,
                creditProductService: this.creditProductService,
                casualPaymentMethodService: this.casualPaymentMethodService
            })
        }

        logger.info(`The paypoint was retrieved successfully`)
        return paypointCreated
    }

    _retrieveCreditWallets = async (backupGuildId: string, guildRecord: IGuild): Promise<ICreditWallet[]> => {
        const creditWalletRecords = await this.creditWalletService.getAll(backupGuildId)
        .then(result => result.isSuccess() ? result.value : Promise.reject(result.error))

        const creditWalletsRetrieved: ICreditWallet[] = []

        for (const creditWalletRecord of creditWalletRecords) {
            const memberRecord = await this.memberService.get(creditWalletRecord.memberId, guildRecord.id)
            .then(result => result.isSuccess() ? result.value : null)

            if (!memberRecord) continue

            const creditWallet = new CreditWallet({
                guild: guildRecord,
                member: memberRecord,
                credits: creditWalletRecord.credits,
            })

            const creditWalletCreated = await this.creditWalletService.create(creditWallet)
            .then(result => result.isSuccess() ? result.value : Promise.reject(result.error))

            creditWalletsRetrieved.push(creditWalletCreated)

            logger.info(`The credit wallet for ${creditWalletCreated.member.username} was restored`)
        }
        return creditWalletsRetrieved
    }

    _retrieveCreditProducts = async (backupGuildId: string, guildRecord: IGuild): Promise<ICreditProduct[]> => {
        const creditProductRecords = await this.creditProductService.getAll(backupGuildId)
        .then(result => result.isSuccess() ? result.value : Promise.reject(result.error))

        const creditProductsRetrieved: ICreditProduct[] = []

        for (const creditProductRecord of creditProductRecords) {
            const creditProduct = new CreditProduct({
                guild: guildRecord,
                credits: creditProductRecord.credits,
                price: creditProductRecord.price,
                media: creditProductRecord.media ?? undefined,
                mediaFilename: creditProductRecord.mediaFilename ?? undefined,
                description: creditProductRecord.description ?? undefined
            })

            const creditProductCreated = await this.creditProductService.create(creditProduct)
            .then(result => result.isSuccess() ? result.value : Promise.reject(result.error))

            creditProductsRetrieved.push(creditProductCreated)

            logger.info(`The credit product ${creditProductCreated.name} was restored`)
        }
        return creditProductsRetrieved
    }

    _retrieveCreditRewards = async (backupGuildId: string, guildRecord: IGuild): Promise<ICreditReward[]> => {
        const creditRewardRecords = await this.creditRewardService.getAll(backupGuildId)
        .then(result => result.isSuccess() ? result.value : Promise.reject(result.error))

        const creditRewardsRetrieved: ICreditReward[] = []

        for (const creditRewardRecord of creditRewardRecords) {
            const creditReward = new CreditReward({
                guild: guildRecord,
                credits: creditRewardRecord.credits,
                invitesRequired: creditRewardRecord.invitesRequired,
            })

            const creditRewardCreated = await this.creditRewardService.create(creditReward)
            .then(result => result.isSuccess() ? result.value : Promise.reject(result.error))

            creditRewardsRetrieved.push(creditRewardCreated)

            logger.info(`The credit reward ${creditRewardCreated.name} was restored`)
        }
        return creditRewardsRetrieved
    }

    _retrieveInvitePoint = async (
        backupGuildId: string, 
        guildRecord: IGuild, 
        textChannelsLastReference: Record<string, DiscordTextChannel>
    ): Promise<IInvitePoint | undefined> => {
        const invitePointRecord = await this.invitePointService.get(backupGuildId)
        .then(r => {
            if (!r.isSuccess() && !(r.error instanceof PaypointNotFoundError)) return Promise.reject(r.error) 
            return r.value
        })

        if (!invitePointRecord) return

        const invitePoint = new InvitePoint({
            title: invitePointRecord.title,
            description: invitePointRecord.description,
            media: invitePointRecord.media ?? undefined,
            mediaCodec: invitePointRecord.mediaCodec ?? undefined,
            messageId: invitePointRecord.messageId ?? undefined,
            channelId: invitePointRecord.channelId ?? undefined,
            guild: guildRecord
        })

        const invitePointCreated = await this.invitePointService.create(invitePoint)
        .then(result => result.isSuccess() ? result.value : Promise.reject(result.error))

        if (invitePointRecord.channelId && invitePointRecord.messageId) {
            const textChannel: DiscordTextChannel = textChannelsLastReference[invitePointRecord.channelId]
            
            if (textChannel) await InvitePointMessage.create({
                service: this.invitePointService, 
                channel: textChannel, 
                guildId: guildRecord.id 
            })
        }

        return invitePointCreated
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

            const guildRecord = await this.guildService.get(guild.id)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

            const backups = await this.service.getAll(guildRecord.id)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

            const description = backups.length === 0
                ? 'There are no backups'
                : '' + backups
                    .map(backup => `${backup.name.toUpperCase()} : ${backup.createdBy.toUpperCase()}`)
                    .join('\n')

            await EmbedResult.success({
                title: 'Backup list',
                description: description,
                interaction: interaction
            })

        }
        catch (e) {
            await EmbedResult.fail({
                title: 'Failed to get backup list',
                description: String(e),
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
            
            const guildRecord = await this.guildService.get(guild.id)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))
    
            await this.service.get(name)
            .then(r => r.isSuccess() ? Promise.reject(new BackupAlreadyExistsError()) : null)
    
            const backup = new Backup({
                name: name,
                guildId: guild.id,
                guild: guildRecord,
                createdBy: interaction.user.id,
            })
    
            const backupCreated = await this.service.create(backup)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

            const title = 'Backup created'
            const description = InlineBlockText(`Backup ${backupCreated.name} created successfully by ${backupCreated.createdBy}`)
    
            await EmbedResult.success({title, description, interaction})
        }
        catch (e) {
            await EmbedResult.fail({
                title: 'Failed to create backup',
                description: InlineBlockText((e as Error).message),
                interaction: interaction
            })
        }
    }

    delete = async (interaction: ChatInputCommandInteraction) => {
        try {
            const name = interaction.options.getString('name')
            if (!name) throw new BackupNameRequiredError()

            const backupDeleted = await this.service.delete(name)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

            await EmbedResult.success({
                title: 'Backup deleted',
                description: `Backup ${backupDeleted.name} deleted successfully`,
                interaction: interaction
            })
        }
        catch (e) {
            let descriptionError: string | undefined

            if (e instanceof BackupNotFoundError) {
                descriptionError = 'The backup does not exist'
            }

            await EmbedResult.fail({
                title: 'Backup deletion failed',
                description: InlineBlockText(descriptionError ?? String((e as Error).message)),
                interaction: interaction
            })
        }
    }
}