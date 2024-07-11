import { BaseSlashCommand } from "../SlashCommandBase.js"

const PaypointCommand = new BaseSlashCommand()

PaypointCommand
    .setName('paypoint')
    .setDescription('Paypoint')

    .addSubcommand(subcommand =>
        subcommand
            .setName('create')
            .setDescription('Create a new paypoint')

            .addRoleOption(option => option
                .setName('role')
                .setDescription('The role that will be selled')
                .setRequired(true)
            )

            .addIntegerOption(option => option
                .setName('price')
                .setDescription('The price of the role')
                .setRequired(true)
            )

            .addAttachmentOption(option => option
                .setName('image')
                .setDescription('The image of the role as product')
                .setRequired(true)
            )

            .addStringOption(option => option
                .setName('description')
                .setDescription('The description of the role as product')
                .setRequired(true)
            )
            
            .addChannelOption(option => option
                .setName('channel')
                .setDescription('The channel where the notification paypoint will be sent')
                .setRequired(false)
            )
    )

PaypointCommand.setDefaultMemberPermissions(8)
PaypointCommand.setDMPermission(false)

export { PaypointCommand }
