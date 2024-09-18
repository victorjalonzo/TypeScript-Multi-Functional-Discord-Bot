import { Database } from "./Database.js";
import { MongoRepository } from "./MongoRepository.js";
import { SlashCommandCallable } from '../../shared/intraestructure/SlashCommandCallable.js';

import { PaypointModel } from "../../Paypoint/infrastructure/PaypointSchema.js";
import { PaypointService } from "../../Paypoint/application/PaypointService.js";
import { PaypointCommand } from '../../Paypoint/infrastructure/PaypointCommand.js';
import { PaypointCommandActions } from "../../Paypoint/infrastructure/PaypointCommandActions.js";
import { PaypointComponentActions } from "../../Paypoint/infrastructure/PaypointComponentActions.js";

import { CasualPaymentModel } from "../../CasualPayment/infrastructure/CasualPaymentSchema.js";
import { CasualPaymentService } from "../../CasualPayment/application/CasualPaymentService.js";
import { CasualPaymentCommand } from '../../CasualPayment/infrastructure/CasualPaymentCommand.js';
import { CasualPaymentCommandActions } from "../../CasualPayment/infrastructure/CasualPaymentCommandActions.js";

import { CreditModel } from "../../CreditProduct/infrastructure/CreditProductSchema.js";
import { CreditProductService } from "../../CreditProduct/application/CreditProductService.js";
import { CreditCommand } from '../../CreditProduct/infrastructure/CreditProductCommand.js';
import { CreditProductsCommandActions } from "../../CreditProduct/infrastructure/CreditProductCommandActions.js";

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

import { CasualTransactionModel } from "../../CasualTransaction/infrastructure/CasualTransactionSchema.js";
import { CasualTransactionService } from "../../CasualTransaction/application/CasualTransactionService.js";

import { AgentEventController } from "../../Agent/infrastructure/AgentEventController.js";

import { DMConversactionService } from "../../DMConversaction/application/DMConversactionService.js";
import { DMConversactionModel } from "../../DMConversaction/infrastructure/DMConversactionSchema.js";
import { IComponentAction } from "../domain/IComponentAction.js";
import { AgentComponentsActions } from "../../Agent/infrastructure/AgentComponentsActions.js";

import { BackupModel } from "../../Backup/infrastructure/BackupSchema.js";
import { BackupService } from "../../Backup/application/BackupService.js";
import { BackupCommand } from "../../Backup/infrastructure/BackupCommand.js";
import { BackupCommandAction } from "../../Backup/infrastructure/BackupCommandAction.js";
import { RoleProductEventController } from "../../RoleProduct/infrastructure/RoleProductEventController.js";
import { PaypointEventController } from "../../Paypoint/infrastructure/PaypointEventController.js";

import { CreditChannelLockerService } from "../../CreditChannelLocker/application/CreditChannelLockerService.js";
import { CreditChannelLockerCommandActions } from "../../CreditChannelLocker/infraestructure/CreditChannelLockerCommandActions.js";
import { CreditChannelLockerCommand } from "../../CreditChannelLocker/infraestructure/CreditChannelLockerCommand.js";
import { CreditChannelLockerModel } from "../../CreditChannelLocker/infraestructure/CreditChannelLockSchema.js";
import { CreditChannelLockerComponentActions } from "../../CreditChannelLocker/infraestructure/CreditChannelLockerComponentActions.js";

import { CreditWalletModel } from "../../CreditWallet/infrastructure/CreditWalletSchema.js";
import { CreditWalletService } from "../../CreditWallet/application/CreditWalletService.js";
import { CreditWalletEventController } from "../../CreditWallet/infrastructure/CreditWalletEventController.js";
import { CreditWalletCommand } from "../../CreditWallet/infrastructure/CreditWalletCommand.js";
import { CreditWalletCommandActions } from "../../CreditWallet/infrastructure/CreditWalletCommandActions.js";

import { GuildCommandActions } from "../../Guild/infrastructure/GuildCommandActions.js";
import { RoleProductCommand } from "../../RoleProduct/infrastructure/RoleProductCommand.js";
import { RoleProductCommandActions } from "../../RoleProduct/infrastructure/RoleProductCommandActions.js";
import { CreditRewardModel } from "../../CreditReward/infrastructure/CreditRewardSchema.js";
import { CreditRewardService } from "../../CreditReward/application/CreditRewardService.js";
import { CreditRewardEventController } from "../../CreditReward/infrastructure/CreditRewardEventController.js";
import { CreditRewardCommand } from "../../CreditReward/infrastructure/CreditRewardCommand.js";
import { CreditRewardCommandActions } from "../../CreditReward/infrastructure/CreditRewardCommandActions.js";

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
const textChannelService = new TextChannelService(textChannelRepository, guildService, categoryChannelService);
const textChannelEventController = new TextChannelEventController(textChannelService);

const voiceChannelRepository = new Repository(VoiceChannelModel);
const voiceChannelService = new VoiceChannelService(voiceChannelRepository, guildService, categoryChannelService);
const voiceChannelEventController = new VoiceChannelEventController(voiceChannelService);

const roleRepository = new Repository(RoleRecordModel);
const roleService = new RoleService(roleRepository);
const roleEventController = new RoleEventController(roleService);

const guildCommandActions = new GuildCommandActions(guildService, roleService, textChannelService);
GuildCommand.setCallback(guildCommandActions.execute);

const casualPaymentRepository = new Repository(CasualPaymentModel);
const casualPaymentService = new CasualPaymentService(casualPaymentRepository, guildRepository);
const casualPaymentCommandAction = new CasualPaymentCommandActions(casualPaymentService);
CasualPaymentCommand.setCallback(casualPaymentCommandAction.execute);

const creditWalletRepository = new Repository(CreditWalletModel);
const creditWalletService = new CreditWalletService(creditWalletRepository);
const creditWalletEventController = new CreditWalletEventController(creditWalletService, guildService, memberService);
const creditWalletCommandActions = new CreditWalletCommandActions(creditWalletService);
CreditWalletCommand.setCallback(creditWalletCommandActions.execute);

const creditProductRepository = new Repository(CreditModel);
const creditProductService = new CreditProductService(creditProductRepository, guildRepository);
const creditProductCommandAction = new CreditProductsCommandActions(creditProductService, guildService);
CreditCommand.setCallback(creditProductCommandAction.execute);

const paypointRepository = new Repository(PaypointModel);

const roleProductRepository = new Repository(RoleProductModel);
const roleProductService = new RoleProductService(roleProductRepository);
const roleProductEventController = new RoleProductEventController(roleProductService);
const roleProductCommandActions = new RoleProductCommandActions(roleProductService, guildService, roleService);
RoleProductCommand.setCallback(roleProductCommandActions.execute);

const casualTransactionRepository = new Repository(CasualTransactionModel);
const casualTransactionService = new CasualTransactionService(casualTransactionRepository);

const DMConversactionRepository = new Repository(DMConversactionModel);
const dmConversactionService = new DMConversactionService(DMConversactionRepository);

const paypointService = new PaypointService(paypointRepository, guildRepository);
const paypointCommandAction = new PaypointCommandActions(paypointService, guildService, roleProductService, creditProductService, casualPaymentService);
const paypointComponentAction = new PaypointComponentActions(paypointService, casualPaymentService, roleProductService, creditProductService, dmConversactionService, memberService);
const paypointEventController = new PaypointEventController(paypointService);
PaypointCommand.setCallback(paypointCommandAction.execute);

const creditChannelLockerRepository = new Repository(CreditChannelLockerModel);
const creditChannelLockerService = new CreditChannelLockerService(creditChannelLockerRepository);
const creditChannelLockerComponentAction = new CreditChannelLockerComponentActions(creditChannelLockerService, creditWalletService, paypointService);
const creditChannelLockerCommandAction = new CreditChannelLockerCommandActions(creditChannelLockerService);
CreditChannelLockerCommand.setCallback(creditChannelLockerCommandAction.execute);

const creditRewardRepository = new Repository(CreditRewardModel)
const creditRewardService = new CreditRewardService(creditRewardRepository)
const creditRewardEventController = new CreditRewardEventController(creditRewardService, memberService, creditWalletService)
const creditRewardCommandActions = new CreditRewardCommandActions(creditRewardService, guildService)
CreditRewardCommand.setCallback(creditRewardCommandActions.execute);

const rewardRoleRespository = new Repository(RewardRoleModel);
const rewardRoleService = new RewardRoleService(rewardRoleRespository);
const rewardRoleCommandAction = new RewardRoleCommandActions(rewardRoleService, roleService);
const rewardRoleEventController = new RewardRoleEventController(rewardRoleService, memberService);
RewardRoleCommand.setCallback(rewardRoleCommandAction.execute);

const inviteCommandActions = new InviteCommandActions(memberService, rewardRoleService);
const inviteEventController = new InviteEventController(memberService);
InviteCommand.setCallback(inviteCommandActions.execute);

const agentEventController = new AgentEventController(casualTransactionService, paypointService, roleProductService, rewardRoleService, dmConversactionService, memberService);
const agentComponentActions = new AgentComponentsActions(dmConversactionService, casualTransactionService, roleProductService, creditProductService, creditWalletService);

const backupRepository = new Repository(BackupModel);
const backupService = new BackupService(backupRepository);
const backupCommandAction = new BackupCommandAction(backupService, guildService, roleService, textChannelService, voiceChannelService, categoryChannelService, memberService, roleProductService, creditProductService, rewardRoleService, casualPaymentService, paypointService);
BackupCommand.setCallback(backupCommandAction.execute);

export const Services = {
    guildService,
    memberService,
    categoryChannelService,
    textChannelService,
    voiceChannelService,
    roleService,
    casualPaymentService,
    creditService: creditProductService,
    creditChannelLockerService,
    creditWalletService,
    creditRewardService,
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
    inviteEventController,
    agentEventController,
    roleProductEventController,
    paypointEventController,
    creditWalletEventController,
    creditRewardEventController,
}

export const Commands: SlashCommandCallable[] = [ 
    CasualPaymentCommand,
    CreditCommand,
    PaypointCommand,

    GuildCommand, 
    InviteCommand, 
    RewardRoleCommand,
    IntegratedPaymentCommand,
    BackupCommand,
    CreditChannelLockerCommand,
    CreditWalletCommand,
    CreditRewardCommand,
    RoleProductCommand
]

export const CommandActions = {
    guildCommandActions, 
    paypointCommandAction,
    creditCommandAction: creditProductCommandAction,
    creditChannelLockerCommandAction,
    rewardRoleCommandAction,
    casualPaymentCommandAction,
    backupCommandAction,
    creditWalletCommandActions,
    creditRewardCommandActions,
    RoleProductCommandActions
}

export const ComponentActions: IComponentAction[] = [
    agentComponentActions,
    paypointComponentAction,
    creditChannelLockerComponentAction
]