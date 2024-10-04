import { AttachmentBuilder, TextChannel as DiscordTextChannel, Message } from "discord.js";
import { createInvitePointMenuEmbed } from "./Embeds/InvitePointMenuEmbed.js";
import { IInvitePointInput } from "../domain/IInvitePointInput.js";
import { getAttachmentFromBuffer } from "../../shared/utils/AttachmentBuffer.js";

interface IOptions {
    service: IInvitePointInput,
    channel: DiscordTextChannel,
    guildId: string
}

export class InvitePointMessage {
    static create = async (options: IOptions): Promise<Message<boolean>> => {
        const { service, channel, guildId } = options
    
        const invitePoint = await service.get(guildId)
        .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

        const media = invitePoint.media
            ? await getAttachmentFromBuffer(invitePoint.media)
            : undefined

        const {embed, buttonRow, files, } = await createInvitePointMenuEmbed({
            title: invitePoint.title, 
            description: invitePoint.description,
            media: media
        })

        const message =  await channel.send({
            embeds: [embed],
            components: [<any>buttonRow], 
            files: files
        })

        invitePoint.channelId = message.channelId
        invitePoint.messageId = message.id
        
        await service.update(invitePoint)

        return message
    }
}