import { RichSlashCommand } from "../../shared/intraestructure/RichSlashCommand.js"

const InviteCommand = new RichSlashCommand()

InviteCommand
    .setName('invite')
    .setDescription('Show your current invites amount.')

    .addUserOption(option => option
        .setName('user')
        .setDescription('The user')
        .setRequired(false)
    )

InviteCommand.setDMPermission(false)

export { InviteCommand }