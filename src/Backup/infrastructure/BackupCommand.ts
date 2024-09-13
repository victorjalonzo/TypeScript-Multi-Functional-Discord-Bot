import { SlashCommandCallable } from "../../shared/intraestructure/SlashCommandCallable.js"

const BackupCommand = new SlashCommandCallable()

BackupCommand
    .setName('backup')
    .setDescription('Command for Backup management')

    .addSubcommand(subcommand => 
        subcommand
            .setName('load')
            .setDescription('load a backup')
            .addStringOption(option => option
                .setName('name')
                .setDescription('The name of the backup')
                .setRequired(true)
            )
        )

    .addSubcommand(subcommand => 
        subcommand
            .setName('create')
            .setDescription('create a backup')
            .addStringOption(option => option
                .setName('name')
                .setDescription('The name of the backup')
                .setRequired(true)
            )
        )
        
    .addSubcommand(subcommand => 
        subcommand
            .setName('remove')
            .setDescription('Remove a backup')
            .addStringOption(option => option
                .setName('name')
                .setDescription('The name of the payment')
                .setRequired(true)
            )
        )

        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('List all backups')
        );

BackupCommand.setDefaultMemberPermissions(8)
BackupCommand.setDMPermission(false)

export  { BackupCommand }