import { Database } from "./Database.js";
import { MongoRepository } from "./MongoRepository.js";
import { SlashCommandCallable } from '../../shared/intraestructure/SlashCommandCallable.js';

import { PaypointModel } from "../../PaypointRole/infrastructure/PaypointSchema.js";
import { PaypointService } from "../../PaypointRole/application/PaypointService.js";
import { PaypointCommand } from '../../PaypointRole/infrastructure/PaypointCommand.js';
import { PaypointCommandActions } from "../../PaypointRole/infrastructure/PaypointCommandActions.js";
import { PaypointComponentActions } from "../../PaypointRole/infrastructure/PaypointComponentActions.js";

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

import { CategoryChannelModel } from "../../CategoryChannel/infrastructure/CategoryChannelSchema.js";
import { CategoryChannelService } from "../../CategoryChannel/application/CategoryChannelService.js";
import { CategoryChannelEventController } from "../../CategoryChannel/infrastructure/CategoryChannelEventController.js";

import { TextChannelModel } from "../../TextChannel/infrastructure/TextChannelSchema.js";
import { TextChannelService } from "../../TextChannel/application/TextChannelService.js";
import { TextChannelEventController } from "../../TextChannel/infrastructure/TextChannelEventController.js";

import { VoiceChannelModel } from "../../VoiceChannel/infrastructure/VoiceChannelSchema.js";
import { VoiceChannelService } from "../../VoiceChannel/application/VoiceChannelService.js";
import { VoiceChannelEventController } from "../../VoiceChannel/infrastructure/VoiceChannelController.js";

import { RoleService } from "../../Role/application/RoleService.js";
import { RoleRecordModel } from "../../Role/infrastructure/RoleSchema.js";
import { RoleEventController } from "../../Role/infrastructure/RoleEventController.js";

import { RewardRoleModel } from "../../RewardRole/infrastructure/RewardRoleSchema.js";
import { RewardRoleCommand } from '../../RewardRole/infrastructure/RewardRoleCommand.js';
import { RewardRoleCommandActions } from "../../RewardRole/infrastructure/RewardRoleCommandActions.js";
import { RewardRoleService } from "../../RewardRole/application/RewardRoleService.js";
import { RewardRoleEventController } from "../../RewardRole/infrastructure/RewardRoleEventController.js";

import { InviteCommand } from '../../Invite/infrastructure/InviteCommand.js';
import { InviteCommandActions } from "../../Invite/infrastructure/InviteCommandActions.js";
import { InviteEventController } from "../../Invite/infrastructure/InviteEventController.js";

import { IntegratedPaymentCommand } from '../../IntegratedPayment/infrastructure/IntegratedPaymentCommand.js';
import { RoleProductModel } from "../../RoleProduct/infrastructure/RoleProductSchema.js";
import { RoleProductService } from "../../RoleProduct/application/RoleProductService.js";

await Database.connect()

const Repository = MongoRepository

const guildRepository = new Repository(GuildModel);
const guildService = new GuildService(guildRepository);
const guildController = new GuildController(guildService);

const memberRepository = new Repository(memberModel);
const memberService = new MemberService(memberRepository);
const memberController = new MemberController(memberService);

const categoryChannelRepository = new Repository(CategoryChannelModel);
const categoryChannelService = new CategoryChannelService(categoryChannelRepository);
const categoryChannelEventController = new CategoryChannelEventController(categoryChannelService);

const textChannelRepository = new Repository(TextChannelModel);
const textChannelService = new TextChannelService(textChannelRepository);
const textChannelEventController = new TextChannelEventController(textChannelService);

const voiceChannelRepository = new Repository(VoiceChannelModel);
const voiceChannelService = new VoiceChannelService(voiceChannelRepository);
const voiceChannelEventController = new VoiceChannelEventController(voiceChannelService);

const roleRepository = new Repository(RoleRecordModel);
const roleService = new RoleService(roleRepository);
const roleEventController = new RoleEventController(roleService);

const casualPaymentRepository = new Repository(CasualPaymentModel);
const casualPaymentService = new CasualPaymentService(casualPaymentRepository, guildRepository);
const casualPaymentCommandAction = new CasualPaymentCommandActions(casualPaymentService);
CasualPaymentCommand.setCallback(casualPaymentCommandAction.execute);

const creditRepository = new Repository(CreditModel);
const creditService = new CreditService(creditRepository, guildRepository);
const creditCommandAction = new CreditCommandActions(creditService);
CreditCommand.setCallback(creditCommandAction.execute);

const paypointRepository = new Repository(PaypointModel);

const roleProductRepository = new Repository(RoleProductModel);
const roleProductService = new RoleProductService(roleProductRepository, paypointRepository);

const paypointService = new PaypointService(paypointRepository, guildRepository, casualPaymentRepository);
const paypointCommandAction = new PaypointCommandActions(paypointService, roleService, roleProductService, casualPaymentService);
const paypointComponentAction = new PaypointComponentActions(paypointService, casualPaymentService, roleProductService);
PaypointCommand.setCallback(paypointCommandAction.execute);

const rewardRoleRespository = new Repository(RewardRoleModel);
const rewardRoleService = new RewardRoleService(rewardRoleRespository);
const rewardRoleCommandAction = new RewardRoleCommandActions(rewardRoleService);
const rewardRoleEventController = new RewardRoleEventController(rewardRoleService, memberService);
RewardRoleCommand.setCallback(rewardRoleCommandAction.execute);

const inviteCommandActions = new InviteCommandActions(memberService, rewardRoleService);
const inviteEventController = new InviteEventController(memberService);
InviteCommand.setCallback(inviteCommandActions.execute);


export const Services = {
    guildService,
    memberService,
    categoryChannelService,
    textChannelService,
    voiceChannelService,
    roleService,
    casualPaymentService,
    creditService,
    paypointService,
    roleProductService,
    rewardRoleService
}

export const Controllers = {
    guildController,
    memberController,
    categoryChannelEventController,
    textChannelEventController,
    voiceChannelEventController,
    roleEventController,
    rewardRoleEventController,
    inviteEventController
}

export const Commands: SlashCommandCallable[] = [ 
    CasualPaymentCommand,
    CreditCommand,
    PaypointCommand,

    GuildCommand, 
    InviteCommand, 
    RewardRoleCommand,
    IntegratedPaymentCommand,
]

export const CommandActions = {
    paypointCommandAction,
    creditCommandAction,
    rewardRoleCommandAction,
    casualPaymentCommandAction
}

export const ComponentActions = [
    paypointComponentAction
]