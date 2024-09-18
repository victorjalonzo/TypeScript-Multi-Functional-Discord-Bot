import { ChatInputCommandInteraction, PermissionOverwrites, TextChannel } from "discord.js";
import { ICreditChannelLocker } from "../domain/ICreditChannelLock.js";
import { ICreditChannelLockerInput } from "../domain/ICreditChannelLockerInput.js";
import { GuildNotFoundError, UnknownInteractionError } from "../../shared/domain/Exceptions.js";
import { EmbedResult } from "../../shared/intraestructure/EmbedResult.js";
import { InlineBlockText } from "../../shared/utils/textFormating.js";
import { logger } from "../../shared/utils/logger.js";
import { CreditChannelLocker } from "../domain/CreditChannelLocker.js";
import { getAttachmentFromBuffer, getBufferFromAttachment } from "../../shared/utils/AttachmentBuffer.js";
import { createGuildUnlockChannelEmbed } from "./Embeds/GuildUnlockChannelEmbed.js";

export class CreditChannelLockerCommandActions {
    constructor (private service: ICreditChannelLockerInput) {}

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


            const lockerChannel = await guild.channels.create({
                name: `${sourceChannel.name}-locked`,
                parent: sourceChannel.parentId,
                type: sourceChannel.type
            })

            const everyone = guild.roles.everyone
            
            sourceChannel.permissionOverwrites.edit(everyone, {
                ViewChannel: false
            })

            let mediaCodec = null
            let mediaBuffer = null
            let mediaAttachmentBuilder = null

            if (media) {
                mediaCodec = media.name.split('.').pop()
                mediaBuffer = await getBufferFromAttachment(media)
                mediaAttachmentBuilder = await getAttachmentFromBuffer(mediaBuffer, media.name)
            }

            const {embed, files, buttonRow} = await createGuildUnlockChannelEmbed({
                sourceChannelId: sourceChannel.id,
                lockerChannelId: lockerChannel.id,
                price: price,
                description: description,
                media: mediaAttachmentBuilder,
                mediaCodec: mediaCodec
            })

            const updatableMessage = await lockerChannel.send({
                embeds: [embed], 
                files: files, 
                components: [<any>buttonRow]
            })

            const creditChannelLock = new CreditChannelLocker({
                id: lockerChannel.id,
                sourceChannelId: sourceChannel.id,
                updatableMessageId: updatableMessage.id,
                price: price,
                description: description,
                media: mediaBuffer,
                mediaCodec: mediaCodec
            })

            const result = await this.service.create(creditChannelLock)
            if (!result.isSuccess()) throw result.error

            const creditChannelLockCreated = result.value

            const title = "CHANNEL LOCKED"
            const content = `You have locked the channel: <#${sourceChannel.id}> successfully.`
            const info = InlineBlockText(`Channel name: ${sourceChannel.name}\nChannel ID: ${sourceChannel.id}\nPrice: ${creditChannelLockCreated.price}`)

            return await EmbedResult.success({title, description: content+info, interaction})
        }
        catch (e) {
            logger.warn(String(e))
            return await EmbedResult.fail({description: InlineBlockText(String(e)), interaction})
        }
    }
}