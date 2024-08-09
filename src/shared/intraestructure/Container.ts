import { Database } from "./Database.js";
import { MongoRepository } from "./MongoRepository.js";
import { SlashCommandCallable } from '../../shared/intraestructure/SlashCommandCallable.js';

import { PaypointModel } from "../../Paypoint/infrastructure/PaypointSchema.js";
import { PaypointService } from "../../Paypoint/application/PaypointService.js";
import { PaypointCommand } from '../../Paypoint/infrastructure/PaypointCommand.js';
import { PaypointCommandActions } from "../../Paypoint/infrastructure/PaypointCommandActions.js";
import { PaypointButtonActions } from "../../Paypoint/infrastructure/PaypointButtonActions.js";

import { CasualPaymentModel } from "../../CasualPayment/infrastructure/CasualPaymentSchema.js";
import { CasualPaymentService } from "../../CasualPayment/application/CasualPaymentService.js";
import { CasualPaymentCommand } from '../../CasualPayment/infrastructure/CasualPaymentCommand.js';
import { CasualPaymentCommandActions } from "../../CasualPayment/infrastructure/CasualPaymentCommandActions.js";

import { CreditModel } from "../../Credit/infrastructure/CreditSchema.js";
import { CreditService } from "../../Credit/application/CreditService.js";
import { CreditCommand } from '../../Credit/infrastructure/CreditCommand.js';
import { CreditCommandActions } from "../../Credit/infrastructure/CreditCommandActions.js";

import { GuildModel } from "../../Guild/infrastructure/GuildSchema.js";
import { GuildService } from "../../Guild/application/GuildService.js";
import { GuildController } from "../../Guild/infrastructure/GuildController.js";
import { GuildCommand } from '../../Guild/infrastructure/GuildCommand.js';

import { memberModel } from "../../Member/infrastructure/MemberSchema.js";
import { MemberService } from "../../Member/application/MemberService.js";
import { MemberController } from "../../Member/infrastructure/MemberController.js";

import { ChannelModel } from "../../Channel/infrastructure/ChannelSchema.js";
import { ChannelService } from "../../Channel/application/ChannelService.js";
import { ChannelController } from "../../Channel/infrastructure/ChannelController.js";

import { InviteCommand } from '../../Invite/infrastructure/InviteCommand.js';
import { RewardCommand } from '../../Reward/infrastructure/RewardCommand.js';
import { IntegratedPaymentCommand } from '../../IntegratedPayment/infrastructure/IntegratedPaymentCommand.js';

await Database.connect()

const Repository = MongoRepository

const guildRepository = new Repository(GuildModel);
const guildService = new GuildService(guildRepository);
const guildController = new GuildController(guildService);

const memberRepository = new Repository(memberModel);
const memberService = new MemberService(memberRepository);
const memberController = new MemberController(memberService);

const channelRepository = new Repository(ChannelModel);
const channelService = new ChannelService(channelRepository);
const channelController = new ChannelController(channelService);

const casualPaymentRepository = new Repository(CasualPaymentModel);
const casualPaymentService = new CasualPaymentService(casualPaymentRepository, guildRepository);
const casualPaymentCommandAction = new CasualPaymentCommandActions(casualPaymentService);
CasualPaymentCommand.setCallback(casualPaymentCommandAction.execute);

const creditRepository = new Repository(CreditModel);
const creditService = new CreditService(creditRepository, guildRepository);
const creditCommandAction = new CreditCommandActions(creditService);
CreditCommand.setCallback(creditCommandAction.execute);

const paypointRepository = new Repository(PaypointModel);
const paypointService = new PaypointService(paypointRepository, guildRepository, creditRepository, casualPaymentRepository);
const paypointCommandAction = new PaypointCommandActions(paypointService, creditService, casualPaymentService);
const paypointButtonAction = new PaypointButtonActions(paypointService, creditService, casualPaymentService);
PaypointCommand.setCallback(paypointCommandAction.execute);


export const Services = {
    guildService,
    memberService,
    channelService,
    casualPaymentService,
    creditService,
    paypointService
}

export const Controllers = {
    guildController,
    memberController,
    channelController
}

export const Commands: SlashCommandCallable[] = [ 
    CasualPaymentCommand,
    CreditCommand,
    PaypointCommand,

    GuildCommand, 
    InviteCommand, 
    RewardCommand,
    IntegratedPaymentCommand,
]

export const CommandActions = {
    paypointCommandAction
}

export const ButtonActions = [
    paypointButtonAction
]