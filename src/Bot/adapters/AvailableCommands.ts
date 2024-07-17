import { RichSlashCommand } from '../../shared/intraestructure/RichSlashCommand.js';

import { GuildCommand } from '../../Guild/intrastructure/GuildCommand.js';
import { InviteCommand } from '../../Invite/infrastructure/InviteCommand.js';
import { PaypointCommand } from '../../Paypoint/infrastructure/PaypointCommand.js';
import { RewardCommand } from '../../Reward/infrastructure/RewardCommand.js';
import { IntegratedPaymentCommand } from '../../IntegratedPayment/infrastructure/IntegratedPaymentCommand.js';
import { CasualPaymentCommand } from '../../CasualPayment/infrastructure/CasualPaymentCommand.js';

export const availableCommands: RichSlashCommand[] = [ 
    GuildCommand, 
    InviteCommand, 
    PaypointCommand, 
    RewardCommand,
    IntegratedPaymentCommand,
    CasualPaymentCommand
]