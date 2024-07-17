import { SlashCommandCallable } from "../../shared/intraestructure/SlashCommandCallable.js";
import { GuildActions } from "./GuildActions.js";

const GuildCommand = new SlashCommandCallable()
const actions = new GuildActions()

GuildCommand
    .setName('guild')
    .setDescription('Commands for guilds management')
    .setCallback(actions.execute)
    
    .addSubcommand(subcommand =>
        subcommand
            .setName('create')
            .setDescription('Create a new guild')

            .addStringOption(option => option
                .setName('name')
                .setDescription('The name of the guild')
                .setRequired(true)
            )
            .addStringOption(option => option
                .setName('template')
                .setDescription('The name of the template to use for the guild')
                .setRequired(true)
            )
    )

    .addSubcommand(subcommand =>
        subcommand
            .setName('delete')
            .setDescription('Delete a guild by its ID')

            .addIntegerOption(option => option
                .setName('id')
                .setDescription('The id of the guild')
                .setRequired(true)
            )
    )
            
    .addSubcommand(subcommand =>
        subcommand
            .setName('list')
            .setDescription('Show the list of available guilds')
    )

    .addSubcommand(subcommand =>
        subcommand
            .setName('link')
            .setDescription('Get the link of a guild')

            .addIntegerOption(option => option
                .setName('id')
                .setDescription('The id of the guild')
                .setRequired(true)
            )
    );

GuildCommand.setDefaultMemberPermissions(8)
GuildCommand.setDMPermission(true)

export { GuildCommand }

