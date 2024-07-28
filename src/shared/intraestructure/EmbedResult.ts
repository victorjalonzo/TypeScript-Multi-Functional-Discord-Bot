import { EmbedBuilder, RawFile } from 'discord.js';
import { Asset } from './Asset.js';
import { ChatInputCommandInteraction } from 'discord.js';
import { AttachmentBuilder } from 'discord.js';

interface Author {
    name: string
    icon?: string
    iconURL?: string
}

interface BaseProps {
    author?: Author
    color?: number,
    title?: string,
    description?: string, 
    thumbnail?: string
}

export class EmbedResult {
    static async success ({title, description, thumbnail, interaction}: {title?: string, description: string, interaction: ChatInputCommandInteraction, thumbnail?: string}) {
        const response =  await new EmbedResult().base({
            color: 0x3cb11f,
            author: {name: 'Success', icon: 'success'},
            title,
            description,
            thumbnail
        })

        return interaction.reply({ embeds: [response.embed], files: response.files, ephemeral: true })
    }

    static async fail ({title, description, thumbnail, interaction}: {title?: string, description: string, interaction: ChatInputCommandInteraction, thumbnail?: string}) {
        const response =  await new EmbedResult().base({
            color: 0xee3030,
            author: {name: 'Failed', icon: 'failed'},
            title,
            description,
            thumbnail
        })

        return interaction.reply({ embeds: [response.embed], files: response.files, ephemeral: true })
    }

    static async info ({title, description, thumbnail, interaction}: {title?: string, description: string, interaction: ChatInputCommandInteraction, thumbnail?: string}) {
        const response =  await new EmbedResult().base({
            color: 0x48a2a8,
            author: {name: 'Info', icon: 'info'},
            title,
            description,
            thumbnail
        })

        return interaction.reply({ embeds: [response.embed], files: response.files, ephemeral: true })
    }

    async base ({author, color, title, description, thumbnail}: BaseProps): Promise<{embed: EmbedBuilder, files: AttachmentBuilder[]}> {
        let embed = new EmbedBuilder()

        const files = []

        if (author) {
            if (author.icon) {
                try {
                    const {attachment, attachmentURL } = await Asset.get(author.icon)
                    author.iconURL = attachmentURL
                    files.push(attachment)
                }
                catch (e) {}
            }

            embed.setAuthor({ name: author.name, iconURL: author.iconURL })
        }
            
        if (color) embed.setColor(color)

        if (title) embed.setTitle(title)

        if (description) embed.setDescription(description)

        if (thumbnail) {
            try {
                const {attachment, attachmentURL } = await Asset.get(thumbnail)
                embed.setThumbnail(attachmentURL)
                files.push(attachment)
            }
            catch (e) {}
        }

        return { embed, files }
    }
}