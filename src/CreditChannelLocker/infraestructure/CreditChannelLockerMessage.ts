import { TextChannel } from "discord.js";
import { ICreditChannelLocker } from "../domain/ICreditChannelLock.js";
import { ICreditChannelLockerInput } from "../domain/ICreditChannelLockerInput.js";
import { getAttachmentFromBuffer } from "../../shared/utils/AttachmentBuffer.js";
import { createChannelLockedEmbed } from "./Embeds/ChannelLockedEmbed.js";

interface IProps {
    service: ICreditChannelLockerInput,
    channel: TextChannel,
}

export class CreditChannelLockerMessage {
    static async create({ service, channel }: IProps): Promise<ICreditChannelLocker> {
        const creditChannelLocker = await service.get(channel.id)
        .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

        const media = creditChannelLocker.media
        const codec = creditChannelLocker.mediaCodec

        const mediaAttachment = media && codec 
        ? await getAttachmentFromBuffer(media, `media.${codec}`) : null

        const {embed, files, buttonRow} = await createChannelLockedEmbed({
            sourceChannelId: creditChannelLocker.sourceChannelId,
            lockerChannelId: creditChannelLocker.id,
            price: creditChannelLocker.price,
            description: creditChannelLocker.description,
            media: mediaAttachment,
            mediaCodec: codec
        })

        const updatableMessage = await channel.send({
            embeds: [embed], 
            files: files, 
            components: [<any>buttonRow]
        })

        creditChannelLocker.updatableMessageId = updatableMessage.id

        const creditChannelLockerUpdated = await service.update(creditChannelLocker)
        .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

        return creditChannelLockerUpdated
    }
}