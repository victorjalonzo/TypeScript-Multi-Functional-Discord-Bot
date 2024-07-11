import { BaseSlashCommand } from "../SlashCommandBase.js"

const InviteCommand = new BaseSlashCommand()

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