import { ChatInputCommandInteraction } from "discord.js"

export class GuildActions {
    execute = async (interaction: ChatInputCommandInteraction) => {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'create') return await this.createGuild(interaction)
        if (subcommand === 'delete') return await this.deleteGuild(interaction)
        if (subcommand === 'link') return await this.getGuildLink(interaction)
    }
    createGuild = async (interaction: ChatInputCommandInteraction) => {
        const name = interaction.options.getString('name')
        const template = interaction.options.getString('template')

        console.log(name, template)
        await interaction.reply({content: "Alright", ephemeral: true})
    }
    getGuild = async (interaction: ChatInputCommandInteraction) => {
        const id = interaction.options.getInteger('id')
    }

    deleteGuild = async (interaction: ChatInputCommandInteraction) => {
        const id = interaction.options.getInteger('id')
    }

    getGuildLink = async (interaction: ChatInputCommandInteraction) => {
        const id = interaction.options.getInteger('id')
    }

    getGuildList = async (interaction: ChatInputCommandInteraction) => {}
}