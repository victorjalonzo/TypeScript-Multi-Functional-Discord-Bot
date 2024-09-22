import { SlashCommandCallable } from "../../shared/intraestructure/SlashCommandCallable.js"

const InvitePointCommand = new SlashCommandCallable()

InvitePointCommand
    .setName('invitepoint')
    .setDescription('Commands for invite point managements')

    .addSubcommand(subcommand =>
        subcommand
            .setName('set')
            .setDescription('set or update settings')

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

InvitePointCommand.setDefaultMemberPermissions(8)
InvitePointCommand.setDMPermission(false)

export { InvitePointCommand }
