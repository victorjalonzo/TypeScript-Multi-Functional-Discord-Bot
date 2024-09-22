import { AttachmentBuilder, ChatInputCommandInteraction } from "discord.js";
import { IInvitePointInput } from "../domain/IInvitePointInput.js";
import { IGuildInput } from "../../Guild/domain/IGuildInput.js";
import { GuildNotFoundError } from "../../shared/domain/Exceptions.js";
import { EmbedResult } from "../../shared/intraestructure/EmbedResult.js";
import { getAttachmentFromBuffer, getBufferFromAttachment } from "../../shared/utils/AttachmentBuffer.js";
import { InlineBlockText } from "../../shared/utils/textFormating.js";
import { logger } from "../../shared/utils/logger.js";
import { InvitePoint } from "../domain/InvitePoint.js";
import { createGuildMenuEmbed } from "./Embeds/GuildMenuEmbed.js";

export class InvitePointCommandActions {
    constructor (
        private service: IInvitePointInput,
        private guildService: IGuildInput
    ) {}

    execute = async (interaction: ChatInputCommandInteraction) => {
        const subCommand = interaction.options.getSubcommand()

        if (subCommand === 'create') return await this.create(interaction)
        if (subCommand === 'set') return await this.set(interaction)
    }

    create = async (interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply()

        try {
            const guild = interaction.guild
            if (!guild) throw new GuildNotFoundError()

            const guildCachedResult = await this.guildService.get(guild.id)
            if (!guildCachedResult.isSuccess()) throw guildCachedResult.error

            const result = await this.service.get(guild.id)
            if (!result.isSuccess()) throw result.error

            const invitePoint = result.value

            const media = invitePoint.media
                ? await getAttachmentFromBuffer(invitePoint.media)
                : undefined

            const {embed, buttonRow, files, } = await createGuildMenuEmbed({
                title: invitePoint.title, 
                description: invitePoint.description,
                media: media
            })

            const message =  await interaction.editReply({
                embeds: [embed],
                components: [<any>buttonRow], 
                files: files
            })

            invitePoint.channelId = message.channelId
            invitePoint.messageId = message.id
            
            await this.service.update(invitePoint)

            logger.info(`The invite point was created`)
        }
        catch(e) {
            await EmbedResult.fail({description: InlineBlockText(String(e)), interaction})
            logger.error(String(e))
        }
    }

    set = async (interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply({ephemeral: true})

        try {
            const title = interaction.options.getString('title')
            const description = interaction.options.getString('description')
            const media = interaction.options.getAttachment('media')

            if (!title && !description && !media) throw new Error("No values were provided.")
    
            const guildId = interaction.guildId
            if (!guildId) throw new GuildNotFoundError()

            const guildCachedResult = await this.guildService.get(guildId)
            if (!guildCachedResult.isSuccess()) throw guildCachedResult.error

            const guildCached = guildCachedResult.value
    
            const invitePointResult = await this.service.get(guildId)

            const invitePoint = invitePointResult.isSuccess() 
            ? invitePointResult.value 
            
            : new InvitePoint({
                title: title ?? undefined,
                description: description ?? undefined,
                media: media ? await getBufferFromAttachment(media) : undefined,
                mediaCodec: media ? media.name.split('.').pop() : undefined,
                guild: guildCached, 
                guildId: guildCached.id, 
            })
    
            const invitePointCreatedResult = await this.service.create(invitePoint)
            if (!invitePointCreatedResult.isSuccess()) throw invitePointCreatedResult.error

            await EmbedResult.success({interaction, 
                title: 'Configuration updated', 
                description: InlineBlockText('The Configuration have been updated correctly')
            })

            logger.info("The Invite Point configuration was updated")
        }
        catch(e) {
            await EmbedResult.fail({interaction, description: String(e)})
            logger.warn(String(e))
        }
    }
}