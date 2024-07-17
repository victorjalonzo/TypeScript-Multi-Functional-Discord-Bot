import { RichSlashCommand } from '../../shared/intraestructure/RichSlashCommand.js';
import { GuildCommand } from '../../Guild/intrastructure/GuildCommand.js';
import { InviteCommand } from '../../Invite/infrastructure/InviteCommand.js';
import { PaypointCommand } from '../../Paypoint/infrastructure/PaypointCommand.js';
import { RewardCommand } from '../../Reward/infrastructure/RewardCommand.js';
import { PaymentCommand } from '../../Payment/infrastructure/PaymentCommand.js';

export const availableCommands: RichSlashCommand[] = [ 
    GuildCommand, 
    InviteCommand, 
    PaypointCommand, 
    RewardCommand,
    PaymentCommand
]