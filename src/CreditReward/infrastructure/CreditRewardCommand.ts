import { SlashCommandCallable } from "../../shared/intraestructure/SlashCommandCallable.js"

const CreditRewardCommand = new SlashCommandCallable()

CreditRewardCommand
    .setName('credit-reward')
    .setDescription('Reward credits to a members by its invites amount')

    .addSubcommand(subcommand =>
        subcommand
            .setName('create')
            .setDescription('Create a reward')

            .addIntegerOption(option => option
                .setName('credits')
                .setDescription('The credits amount that will be rewarded to the member')
                .setRequired(true)
            )

            .addIntegerOption(option => option
                .setName('invites')
                .setDescription('The amount of invites required to get the reward')
                .setRequired(true)
            )
    )

    .addSubcommand(subcommand =>
        subcommand
            .setName('delete')
            .setDescription('Delete a reward by its id')

            .addStringOption(option => option
                .setName('id')
                .setDescription("The reward's id of the reward")
                .setRequired(true)
            )
    )

    .addSubcommand(subcommand =>
        subcommand
            .setName('list')
            .setDescription('Show the list of the all rewards')
    )

CreditRewardCommand.setDMPermission(false)
CreditRewardCommand.setDefaultMemberPermissions(8)

export { CreditRewardCommand }