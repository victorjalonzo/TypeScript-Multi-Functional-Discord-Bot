import { SlashCommandCallable } from "../../shared/intraestructure/SlashCommandCallable.js"

const PaypointCommand = new SlashCommandCallable()

PaypointCommand
    .setName('paypoint-role')
    .setDescription('Commands for paypoint that use roles as products')

    .addSubcommand(subcommand =>
        subcommand
            .setName('products-list')
            .setDescription('List roles as products')
    )

    .addSubcommand(subcommand =>
        subcommand
            .setName('add-product')
            .setDescription('Add roles as products')

            .addRoleOption(option => option
                .setName('role')
                .setDescription('The role that will be added as product')
                .setRequired(true)
            )

            .addIntegerOption(option => option
                .setName('price')
                .setDescription('The price of the role')
                .setRequired(true)
            )

            .addAttachmentOption(option => option
                .setName('media')
                .setDescription('The image of the product')
            )

            .addStringOption(option => option
                .setName('description')
                .setDescription('The description of the role')
            )
    )

    .addSubcommand(subcommand =>
        subcommand
            .setName('remove-product')
            .setDescription('Remove roles as products')
            .addRoleOption(option => option
                .setName('role')
                .setDescription('The role that will be removed as product')
                .setRequired(true)
            )
    )

    .addSubcommand(subcommand =>
        subcommand
            .setName('set')
            .setDescription('Create settings')

            .addStringOption(option => option
                .setName('payment-method')
                .setDescription('The type of payment method')
                .setRequired(true)
                .addChoices({
                    name: 'Casual Payment Methods',
                    value: 'Casual'
                }, {
                    name: 'Integrated Payment Methods',
                    value: 'Integrated'
                }, {
                    name: 'Both',
                    value: 'Both'
                })
            )
            .addStringOption(option => option
                .setName('title')
                .setDescription('The title of the paypoint')
            )

            .addStringOption(option => option
                .setName('description')
                .setDescription('The description of the paypoint')
            )

            .addAttachmentOption(option => option
                .setName('media')
                .setDescription('The video/image to show in the paypoint')
            )
    )

    .addSubcommand(subcommand =>
        subcommand
            .setName('create')
            .setDescription('Create the paypoint')
    )

PaypointCommand.setDefaultMemberPermissions(8)
PaypointCommand.setDMPermission(false)

export { PaypointCommand }
