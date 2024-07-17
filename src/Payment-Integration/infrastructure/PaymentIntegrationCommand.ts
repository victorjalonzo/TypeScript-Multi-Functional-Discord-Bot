import { RichSlashCommand } from "../../shared/intraestructure/RichSlashCommand.js"

const PaymentCommand = new RichSlashCommand()

PaymentCommand
    .setName('payment')
    .setDescription('Command for Payments management')

    .addSubcommand(subcommand =>
        subcommand
            .setName('add')
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
            .setName('remove')
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
            .setName('list')
            .setDescription('List all payment integrations')
    )

PaymentCommand.setDefaultMemberPermissions(8)
PaymentCommand.setDMPermission(false)

export  { PaymentCommand }