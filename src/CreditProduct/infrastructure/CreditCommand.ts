import { SlashCommandCallable } from "../../shared/intraestructure/SlashCommandCallable.js"

const CreditCommand = new SlashCommandCallable()

CreditCommand
    .setName('credit')
    .setDescription('Command for credit management')

    .addSubcommand(subcommand => 
        subcommand
            .setName('add')
            .setDescription('Add a credit')

            .addIntegerOption(option => option
                .setName('price')
                .setDescription('The price of the credit')
                .setRequired(true)
            )

            .addIntegerOption(option => option
                .setName('amount')
                .setDescription('The amount of credits')
                .setRequired(true)
            )

            .addAttachmentOption(option => option
                .setName('media')
                .setDescription('The image of the credit')
            )

            .addStringOption(option => option
                .setName('description')
                .setDescription('The description of the credit')
            )
        )
        
    .addSubcommand(subcommand => 
        subcommand
            .setName('remove')
            .setDescription('Remove a credit')

            .addIntegerOption(option => option
                .setName('id')
                .setDescription('The id of the credit')
                .setRequired(true)
            )
        )

        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('List of all credits available')
        );

CreditCommand.setDefaultMemberPermissions(8)
CreditCommand.setDMPermission(false)

export  { CreditCommand }