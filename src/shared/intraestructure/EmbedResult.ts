import { EmbedBuilder, StringSelectMenuInteraction } from 'discord.js';
import { ChatInputCommandInteraction, ButtonInteraction } from 'discord.js';
import { AttachmentBuilder } from 'discord.js';

import { Asset } from './Asset.js';

interface Author {
    name: string
    icon?: string
    iconURL?: string
}

interface Options {
    author?: Author
    color?: number,
    title?: string,
    description?: string
    thumbnail?: string
    interaction: ChatInputCommandInteraction | ButtonInteraction | StringSelectMenuInteraction
}

export class EmbedResult {
    static async success ({title, description, thumbnail, interaction}: Options) {
        return await new EmbedResult().base({
            color: 0x3cb11f,
            author: {name: 'Success', icon: 'success'},
            title,
            description,
            thumbnail,
            interaction
        })
    }

    static async fail ({title, description, thumbnail, interaction}: Options) {
        return await new EmbedResult().base({
            color: 0xee3030,
            author: {name: 'Failed', icon: 'failed'},
            title,
            description,
            thumbnail,
            interaction
        })
    }

    static async info ({title, description, thumbnail, interaction}: Options) {
        return await new EmbedResult().base({
            color: 0x48a2a8,
            author: {name: 'Info', icon: 'info'},
            title,
            description,
            thumbnail,
            interaction
        })
    }

    async base ({author, color, title, description, thumbnail, interaction}: Options) {
        let embed = new EmbedBuilder()

        const files: AttachmentBuilder[] = []

        if (author) {
            if (author.icon) {
                const {attachment, attachmentURL } = await Asset.get(author.icon)
                author.iconURL = attachmentURL
                files.push(attachment)
            }

            embed.setAuthor({ name: author.name, iconURL: author.iconURL })
        }
            
        if (color) embed.setColor(color)
        if (title) embed.setTitle(title)
        if (description) embed.setDescription(description)

        if (thumbnail) {
            if (thumbnail.includes('http')) {
                embed.setThumbnail(thumbnail)   
            }
            else {
                const {attachment, attachmentURL } = await Asset.get(thumbnail)
                embed.setThumbnail(attachmentURL)
                files.push(attachment)
            }
        }

        if (interaction.deferred) return await interaction.editReply({ embeds: [embed], files })
        return await interaction.reply({ embeds: [embed], files, ephemeral: true })
    }
}