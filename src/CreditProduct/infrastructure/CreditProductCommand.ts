import { SlashCommandCallable } from "../../shared/intraestructure/SlashCommandCallable.js"

const CreditProductCommand = new SlashCommandCallable()

CreditProductCommand
    .setName('credit-product')
    .setDescription('Command for credit product management')

    .addSubcommand(subcommand => 
        subcommand
            .setName('add')
            .setDescription('Add a credit product')

            .addIntegerOption(option => option
                .setName('credits')
                .setDescription('The amount of credits')
                .setRequired(true)
            )

            .addIntegerOption(option => option
                .setName('price')
                .setDescription('The price of the credit')
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

CreditProductCommand.setDefaultMemberPermissions(8)
CreditProductCommand.setDMPermission(false)

export  { CreditProductCommand as CreditCommand }