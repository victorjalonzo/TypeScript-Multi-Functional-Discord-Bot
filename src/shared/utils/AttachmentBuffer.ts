import { Attachment } from "discord.js";
import { AttachmentBuilder } from "discord.js";

export const getBufferFromAttachment = async (attachment: Attachment): Promise<Buffer> => {
    const response = await fetch(attachment.url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return buffer; 
}

export const getAttachmentFromBuffer = async (buffer: Buffer, filename?: string): Promise<AttachmentBuilder> => {
    if (!filename) filename = "attachment.png"
    const attachment = new AttachmentBuilder(buffer, { name: filename });
    
    return attachment;
}