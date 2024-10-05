import { ProductType } from "../../shared/domain/ProductTypeEnums.js"
import { SlashCommandCallable } from "../../shared/intraestructure/SlashCommandCallable.js"

const PaypointCommand = new SlashCommandCallable()

PaypointCommand
    .setName('paypoint')
    .setDescription('Commands for paypoint that use roles as products')

    .addSubcommand(subcommand =>
        subcommand
            .setName('set')
            .setDescription('set or update settings')

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
                .setName('product-type')
                .setDescription('The type of the products below the paypoint')
                .setRequired(true)
                .addChoices({
                    name: 'Credit products',
                    value: ProductType.CREDIT
                }, {
                    name: 'Role products',
                    value: ProductType.ROLE
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
