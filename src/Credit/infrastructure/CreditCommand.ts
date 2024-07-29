import { SlashCommandCallable } from "../../shared/intraestructure/SlashCommandCallable.js"
import { Services } from "../../shared/intraestructure/Container.js"
import { CreditActions } from "./CreditActions.js"

const { creditService } = Services

const CreditCommand = new SlashCommandCallable()
const actions = new CreditActions(creditService)

CreditCommand
    .setName('credit')
    .setDescription('Command for credit management')
    .setCallback(actions.execute)

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
        )
        
    .addSubcommand(subcommand => 
        subcommand
            .setName('remove')
            .setDescription('Remove a credit')

            .addIntegerOption(option => option
                .setName('price')
                .setDescription('The price of the credit to be deleted')
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