import { SlashCommandCallable } from "../../shared/intraestructure/SlashCommandCallable.js"

const RoleProductCommand = new SlashCommandCallable()

RoleProductCommand
    .setName('role-product')
    .setDescription('Commands for roles as products')

    .addSubcommand(subcommand =>
        subcommand
            .setName('list')
            .setDescription('List roles as products')
    )

    .addSubcommand(subcommand =>
        subcommand
            .setName('add')
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
            .setName('remove')
            .setDescription('Remove roles as products')
            .addRoleOption(option => option
                .setName('role')
                .setDescription('The role that will be removed as product')
                .setRequired(true)
            )
    )

RoleProductCommand.setDefaultMemberPermissions(8)
RoleProductCommand.setDMPermission(false)

export { RoleProductCommand }