import { SlashCommandCallable } from "../../shared/intraestructure/SlashCommandCallable.js"

const PaypointCommand = new SlashCommandCallable()

PaypointCommand
    .setName('paypoint')
    .setDescription('Paypoint')

    .addSubcommand(subcommand =>
        subcommand
            .setName('create')
            .setDescription('Create a new paypoint')

            .addStringOption(option => option
                .setName('sale_type')
                .setDescription('The type of sale')
                .setRequired(true)
                .addChoices({
                    name: 'Credit',
                    value: 'Credit'
                }, 
                {
                    name: 'Role',
                    value: 'Role'
                })
            )
            .addStringOption(option => option
                .setName('payment_method_type')
                .setDescription('The type of payment method')
                .setRequired(true)
                .addChoices({
                    name: 'Casual',
                    value: 'Casual'
                }, {
                    name: 'Integrated',
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
                .setName('image')
                .setDescription('The image of the paypoint')
            )
    )

PaypointCommand.setDefaultMemberPermissions(8)
PaypointCommand.setDMPermission(false)

export { PaypointCommand }
