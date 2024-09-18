import { ChannelType } from "discord.js";
import { SlashCommandCallable } from "../../shared/intraestructure/SlashCommandCallable.js";

const GuildCommand = new SlashCommandCallable()

GuildCommand
    .setName('guild')
    .setDescription('Commands for guilds management')

    .addSubcommand(subcommand =>
        subcommand
            .setName('show-information')
            .setDescription('Show the guild configuration and information.')
    )
    
    .addSubcommand(subcommand =>
        subcommand
            .setName('set-default-credits')
            .setDescription('Set the default credits amount of all the members of a guild')

            .addIntegerOption(option => option
                .setName('credits')
                .setDescription('The amount of credits')
                .setRequired(true)
            )
    )

    .addSubcommand(subcommand =>
        subcommand
            .setName('set-default-role')
            .setDescription('Set the default role of all the members of a guild')

            .addRoleOption(option => option
                .setName('role')
                .setDescription('The default role')
                .setRequired(true)
            )
    )

    .addSubcommand(subcommand =>
        subcommand
            .setName('set-default-notification-channel')
            .setDescription('Set the default notification channel of the guild')

            .addChannelOption(option => option
                .setName('channel')
                .setDescription('The default notification channel')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
            )
    )

    .addSubcommand(subcommand =>
        subcommand
            .setName('set-default-invoice-channel')
            .setDescription('Set the default invoice channel of the guild')

            .addChannelOption(option => option
                .setName('channel')
                .setDescription('The default invoice channel')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
            )
    )


GuildCommand.setDefaultMemberPermissions(8)
GuildCommand.setDMPermission(true)

export { GuildCommand }

