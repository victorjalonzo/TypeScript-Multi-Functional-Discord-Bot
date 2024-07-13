import { BaseSlashCommand } from "../SlashCommandBase.js"

const PaymentCommand = new BaseSlashCommand()

PaymentCommand
    .setName('payment')
    .setDescription('Command for Payments management')

    .addSubcommand(subcommand =>
        subcommand
            .setName('add-integration')
            .setDescription('Add a payment integration')

            .addStringOption(option => option
                .setName('name')
                .setDescription('The name of the payment integration')
                .setRequired(true)
                .addChoices (
                    { name: 'Stripe', value: 'stripe' },
                    { name: 'PayPal', value: 'paypal' }
                )
            )
            .addStringOption(option => option
                .setName('public-key')
                .setDescription('The public key of the payment integration')
                .setRequired(true)
            )
            .addStringOption(option => option
                .setName('secret-key')
                .setDescription('The secret key of the payment integration')
                .setRequired(true)
            )
    )

    .addSubcommand(subcommand =>
        subcommand
            .setName('remove-integration')
            .setDescription('Remove a payment integration')
            .addStringOption(option => option
                .setName('name')
                .setDescription('The name of the payment integration')
                .setRequired(true)
                .addChoices (
                    { name: 'Stripe', value: 'stripe' },
                    { name: 'PayPal', value: 'paypal' },
                    { name: 'All', value: 'all' }
                )
            )
    )

    .addSubcommand(subcommand =>
        subcommand
            .setName('list-integrations')
            .setDescription('List all payment integrations')
    )

    .addSubcommand(subcommand => 
        subcommand
            .setName('add-casual')
            .setDescription('Add a casual payment')
            .addStringOption(option => option
                .setName('name')
                .setDescription('The name of the payment')
                .setRequired(true)
                .addChoices(
                    {name: 'Cash App', value: 'cashapp'},
                    {name: 'Zelle', value: 'zelle'},
                    {name: 'PayPal', value: 'paypal'},
                    {name: 'Venmo', value: 'venmo'},
                    {name: 'Apple Pay', value: 'applepay'},
                    {name: 'Google Pay', value: 'googlepay'}
                )
            )
            .addStringOption(option => option
                .setName('value')
                .setDescription('The value of the payment')
                .setRequired(true)
            )
        )
        
    .addSubcommand(subcommand => 
        subcommand
            .setName('remove-casual')
            .setDescription('Remove a casual payment')
            .addStringOption(option => option
                .setName('name')
                .setDescription('The name of the payment')
                .setRequired(true)
                .addChoices(
                    {name: 'Cash App', value: 'cashapp'},
                    {name: 'Zelle', value: 'zelle'},
                    {name: 'PayPal', value: 'paypal'},
                    {name: 'Venmo', value: 'venmo'},
                    {name: 'Apple Pay', value: 'applepay'},
                    {name: 'Google Pay', value: 'googlepay'},
                    {name: 'All', value: 'all'}
                )
            )
        );

export  { PaymentCommand }