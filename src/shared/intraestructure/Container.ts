import { Database } from "./Database.js";
import { MongoRepository } from "./MongoRepository.js";

import { CasualPaymentModel } from "../../CasualPayment/infrastructure/CasualPaymentSchema.js";
import { CasualPaymentService } from "../../CasualPayment/application/CasualPaymentService.js";

import { GuildModel } from "../../Guild/intrastructure/GuildSchema.js";
import { GuildService } from "../../Guild/application/GuildService.js";
import { GuildController } from "../../Guild/intrastructure/GuildController.js";

import { ChannelModel } from "../../Channel/infrastructure/ChannelSchema.js";
import { ChannelService } from "../../Channel/application/ChannelService.js";
import { ChannelController } from "../../Channel/infrastructure/ChannelController.js";

await Database.connect()

const Repository = MongoRepository

const guildRepository = new Repository(GuildModel);
const guildService = new GuildService(guildRepository);
const guildController = new GuildController(guildService);

const channelRepository = new Repository(ChannelModel);
const channelService = new ChannelService(channelRepository);
const channelController = new ChannelController(channelService);

const casualPaymentRepository = new Repository(CasualPaymentModel);
const casualPaymentService = new CasualPaymentService(casualPaymentRepository);

export const Services = {
    guildService,
    channelService,
    casualPaymentService,
}

export const Controllers = {
    guildController,
    channelController
}