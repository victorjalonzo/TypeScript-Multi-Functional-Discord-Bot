import { SlashCommandCallable } from "../../shared/intraestructure/SlashCommandCallable.js"

const RoleRewardCommand = new SlashCommandCallable()

RoleRewardCommand
    .setName('role-reward')
    .setDescription('Reward roles to a members by its invites amount')

    .addSubcommand(subcommand =>
        subcommand
            .setName('create')
            .setDescription('Create a reward')

            .addRoleOption(option => option
                .setName('role')
                .setDescription('The role that will be rewarded to the member that reach the specific amount of invites')
                .setRequired(true)
            )

            .addIntegerOption(option => option
                .setName('invites')
                .setDescription('The amount of invites required to be reached')
                .setRequired(true)
            )
    )

    .addSubcommand(subcommand =>
        subcommand
            .setName('delete')
            .setDescription('Delete a reward by its role')

            .addRoleOption(option => option
                .setName('role')
                .setDescription('The role of the reward')
                .setRequired(true)
            )
    )

    .addSubcommand(subcommand =>
        subcommand
            .setName('list')
            .setDescription('Show the list of the all rewards')
    )

RoleRewardCommand.setDMPermission(false)
RoleRewardCommand.setDefaultMemberPermissions(8)

export { RoleRewardCommand }