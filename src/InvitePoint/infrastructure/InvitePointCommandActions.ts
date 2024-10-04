import { AttachmentBuilder, ChannelType, ChatInputCommandInteraction } from "discord.js";
import { IInvitePointInput } from "../domain/IInvitePointInput.js";
import { IGuildInput } from "../../Guild/domain/IGuildInput.js";
import { GuildNotFoundError } from "../../shared/domain/Exceptions.js";
import { EmbedResult } from "../../shared/intraestructure/EmbedResult.js";
import { getAttachmentFromBuffer, getBufferFromAttachment } from "../../shared/utils/AttachmentBuffer.js";
import { InlineBlockText } from "../../shared/utils/textFormating.js";
import { logger } from "../../shared/utils/logger.js";
import { InvitePoint } from "../domain/InvitePoint.js";
import { createInvitePointMenuEmbed } from "./Embeds/InvitePointMenuEmbed.js";
import { InvitePointMessage } from "./InvitePointMessage.js";
import { TextChannel as DiscordTextChannel } from "discord.js";

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

            const channel = interaction.channel

            if (!channel) throw new Error('Channel not found')
            if (channel.type != ChannelType.GuildText) throw new Error('Wrong channel type')

            await InvitePointMessage.create({
                service: this.service,
                channel: channel,
                guildId: guild.id
            })

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

            const guildRecord = await this.guildService.get(guildId)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))
    
            const invitePointResult = await this.service.get(guildId)

            const invitePoint = invitePointResult.isSuccess() 
            ? invitePointResult.value 
            
            : new InvitePoint({
                title: title ?? undefined,
                description: description ?? undefined,
                media: media ? await getBufferFromAttachment(media) : undefined,
                mediaCodec: media ? media.name.split('.').pop() : undefined,
                guild: guildRecord
            })
    
            await this.service.create(invitePoint)
            .then(r => !r.isSuccess() ? Promise.reject(r.error) : null)

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