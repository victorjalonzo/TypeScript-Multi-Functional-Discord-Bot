import { AttachmentBuilder } from 'discord.js'
import { Config } from "../config/config.js"

const PATH = Config.asset.path

export class Asset {
    static get = async (filename: string): Promise<{
        filename: string, 
        path: string, 
        attachment: AttachmentBuilder, 
        attachmentURL: string
    }> => {
        
        if (!filename) throw new Error("Missing filename")

        const codecs = ["png", "jpg", "jpeg", "webp", "gif"]

        const codec = <string>filename.split(".").pop()

        if (!codecs.includes(codec)) filename += ".png"

        const path = `${PATH}${filename}`

        const attachmentURL = `attachment://${filename}`
        const attachment = new AttachmentBuilder(path, { name: filename })

        return {
            filename, 
            path, 
            attachment, 
            attachmentURL 
        }
    }
}