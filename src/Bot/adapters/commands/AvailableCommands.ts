import { BaseSlashCommand } from './SlashCommandBase.js';
import { GuildCommand } from './SlashCommands/GuildCommand.js';
import { InviteCommand } from './SlashCommands/InviteCommand.js';
import { PaypointCommand } from './SlashCommands/PaypointCommand.js';
import { RewardCommand } from './SlashCommands/RewardCommand.js';

const whiteCommands: BaseSlashCommand[] = []
const darkCommands: BaseSlashCommand[] = []

export const availableCommands: BaseSlashCommand[] = [ 
    GuildCommand, 
    InviteCommand, 
    PaypointCommand, 
    RewardCommand
]