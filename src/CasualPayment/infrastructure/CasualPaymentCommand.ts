import { RichSlashCommand } from "../../shared/intraestructure/RichSlashCommand.js"

const CasualPaymentCommand = new RichSlashCommand()

CasualPaymentCommand
    .setName('payment-casual')
    .setDescription('Command for Casual Payments management')

    .addSubcommand(subcommand => 
        subcommand
            .setName('add')
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
            .setName('remove')
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
        )

        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('List all casual payments')
        );

CasualPaymentCommand.setDefaultMemberPermissions(8)
CasualPaymentCommand.setDMPermission(false)

export  { CasualPaymentCommand }