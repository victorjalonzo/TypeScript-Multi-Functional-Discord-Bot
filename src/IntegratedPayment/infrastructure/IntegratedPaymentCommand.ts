import { SlashCommandCallable } from "../../shared/intraestructure/SlashCommandCallable.js"

const IntegratedPaymentCommand = new SlashCommandCallable()

IntegratedPaymentCommand
    .setName('payment-integrated')
    .setDescription('Command for Integrated Payments management')

    .addSubcommand(subcommand =>
        subcommand
            .setName('add')
            .setDescription('Add a payment integration')

            .addStringOption(option => option
                .setName('name')
                .setDescription('The name of service to integrate')
                .setRequired(true)
                .addChoices (
                    { name: 'Stripe', value: 'stripe' },
                    { name: 'PayPal', value: 'paypal' }
                )
            )
            .addStringOption(option => option
                .setName('public-key')
                .setDescription('The public key of your account')
                .setRequired(true)
            )
            .addStringOption(option => option
                .setName('secret-key')
                .setDescription('The secret key of your account')
                .setRequired(true)
            )
    )

    .addSubcommand(subcommand =>
        subcommand
            .setName('remove')
            .setDescription('Remove an integrated payment')
            .addStringOption(option => option
                .setName('name')
                .setDescription('The name of the integrated payment')
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
            .setDescription('List all integrated payments')
    )

IntegratedPaymentCommand.setDefaultMemberPermissions(8)
IntegratedPaymentCommand.setDMPermission(false)

export  { IntegratedPaymentCommand }