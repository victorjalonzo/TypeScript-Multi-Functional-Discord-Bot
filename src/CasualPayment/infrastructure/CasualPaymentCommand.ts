import { SlashCommandCallable } from "../../shared/intraestructure/SlashCommandCallable.js"
import { Services } from "../../shared/intraestructure/Container.js"
import { CasualPaymentActions } from "./CasualPaymentActions.js"

const { casualPaymentService } = Services

const CasualPaymentCommand = new SlashCommandCallable()
const actions = new CasualPaymentActions(casualPaymentService)

const choices = [
    {name: 'Cash App', value: 'Cash App'},
    {name: 'Zelle', value: 'Zelle'},
    {name: 'PayPal', value: 'PayPal'},
    {name: 'Venmo', value: 'Venmo'},
    {name: 'Apple Pay', value: 'Apple Pay'},
    {name: 'Google Pay', value: 'Google Pay'},
    {name: 'Bitcoin', value: 'Bitcoin'},
    {name: 'Ethereum', value: 'Ethereum'},
]

CasualPaymentCommand
    .setName('payment-casual')
    .setDescription('Command for Casual Payments management')
    .setCallback(actions.execute)

    .addSubcommand(subcommand => 
        subcommand
            .setName('add')
            .setDescription('Add a casual payment')
            .addStringOption(option => option
                .setName('name')
                .setDescription('The name of the payment')
                .setRequired(true)
                .addChoices(...choices)
            )
            .addStringOption(option => option
                .setName('value')
                .setDescription('The value of the payment')
                .setRequired(true)
            )
        )
        
    .addSubcommand(subcommand => 
        subcommand
            .setName('remove')
            .setDescription('Remove a casual payment')
            .addStringOption(option => option
                .setName('name')
                .setDescription('The name of the payment')
                .setRequired(true)
                .addChoices(...choices)
            )
        )

        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('List all casual payments')
        );

CasualPaymentCommand.setDefaultMemberPermissions(8)
CasualPaymentCommand.setDMPermission(false)

export  { CasualPaymentCommand }