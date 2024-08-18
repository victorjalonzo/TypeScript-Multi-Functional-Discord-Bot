import { Attachment } from "discord.js";

export const getBufferFromAttachment = async (attachment: Attachment): Promise<Buffer> => {
    const response = await fetch(attachment.url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return buffer; 
}