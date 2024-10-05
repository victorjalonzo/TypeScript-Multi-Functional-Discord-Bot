import { ChatInputCommandInteraction, PermissionOverwrites, TextChannel } from "discord.js";
import { ICreditChannelLocker } from "../domain/ICreditChannelLock.js";
import { ICreditChannelLockerInput } from "../domain/ICreditChannelLockerInput.js";
import { GuildNotFoundError, UnknownInteractionError } from "../../shared/domain/Exceptions.js";
import { EmbedResult } from "../../shared/intraestructure/EmbedResult.js";
import { InlineBlockText } from "../../shared/utils/textFormating.js";
import { logger } from "../../shared/utils/logger.js";
import { CreditChannelLocker } from "../domain/CreditChannelLocker.js";
import { getAttachmentFromBuffer, getBufferFromAttachment } from "../../shared/utils/AttachmentBuffer.js";
import { createChannelLockedEmbed } from "./Embeds/ChannelLockedEmbed.js";
import { CreditChannelLockerMessage } from "./CreditChannelLockerMessage.js";
import { IGuildInput } from "../../Guild/domain/IGuildInput.js";

export class CreditChannelLockerCommandActions {
    constructor (
        private service: ICreditChannelLockerInput,
        private guildService: IGuildInput
    ) {}

    execute = async (interaction: ChatInputCommandInteraction) => {
        return await this.lock(interaction)
    }

    lock = async (interaction: ChatInputCommandInteraction) => {
        try {
            await interaction.deferReply({ephemeral: true})

            const guild = interaction.guild
            const price = interaction.options.getInteger('price')
            const sourceChannel = interaction.options.getChannel('channel')
            const description = interaction.options.getString('description')
            const media = interaction.options.getAttachment('media')

            if (!guild) throw new GuildNotFoundError()
            if (!price) throw new Error ("Price not provided")
            if (!sourceChannel) throw new Error ("Channel not provided")
            if (!(sourceChannel instanceof TextChannel)) throw new Error ("Channel is not a text channel")

            const guildRecord = await this.guildService.get(guild.id)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

            const lockerChannel = await guild.channels.create({
                name: `${sourceChannel.name}-locked`,
                parent: sourceChannel.parentId,
                type: sourceChannel.type
            })
            
            const creditChannelLocker = new CreditChannelLocker({
                id: lockerChannel.id,
                sourceChannelId: sourceChannel.id,
                price: price,
                description: description ?? undefined,
                media: media ? await getBufferFromAttachment(media) : undefined,
                mediaCodec: media ? media.name.split('.').pop() : undefined,
                guild: guildRecord
            })

            await this.service.create(creditChannelLocker)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

            await CreditChannelLockerMessage.create({ service: this.service, channel: lockerChannel })

            sourceChannel.permissionOverwrites.edit(guild.roles.everyone, {
                ViewChannel: false
            })

            const title = "CHANNEL LOCKED"
            const content = `You have locked the channel: <#${sourceChannel.id}> successfully.`
            const info = InlineBlockText(`Channel name: ${sourceChannel.name}\nChannel ID: ${sourceChannel.id}\nPrice: ${price}`)

            return await EmbedResult.success({title, description: content+info, interaction})
        }
        catch (e) {
            logger.warn(String(e))
            return await EmbedResult.fail({description: InlineBlockText(String(e)), interaction})
        }
    }
}