import { ChannelType } from "discord.js"
import { SlashCommandCallable } from "../../shared/intraestructure/SlashCommandCallable.js"

const CreditChannelLockerCommand = new SlashCommandCallable()

CreditChannelLockerCommand
    .setName('credit-locker')
    .setDescription('Commands for credit locker')

    .addChannelOption(option => option
        .setName('channel')
        .setDescription('The channel that will be locked')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    )

    .addIntegerOption(option => option
        .setName('price')
        .setDescription('The price of the channel')
        .setRequired(true)
    )

    .addStringOption(option => option
        .setName('description')
        .setDescription('The description of the channel')
    )

    .addAttachmentOption(option => option
        .setName('media')
        .setDescription('The image of the channel')
    )

CreditChannelLockerCommand.setDefaultMemberPermissions(8)
CreditChannelLockerCommand.setDMPermission(false)

export { CreditChannelLockerCommand }