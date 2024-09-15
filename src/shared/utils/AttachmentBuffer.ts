import { Attachment } from "discord.js";
import { AttachmentBuilder } from "discord.js";
import sharp from "sharp";

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

export const getBufferFromURL = async (url: string): Promise<Buffer> => {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

  const convertedBuffer = await sharp(buffer)
    .png()
    .toBuffer();

    return convertedBuffer;
}