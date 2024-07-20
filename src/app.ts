import { DiscordAdapter } from "./Bot/adapters/discordAdapter.js";
import { Client, GatewayIntentBits } from "discord.js";
import { Config } from './shared/config/config.js'
import { Database } from "./shared/intraestructure/Database.js";

import { MongoRepository } from "./shared/intraestructure/MongoRepository.js";

import { ChannelModel } from "./Channel/infrastructure/ChannelSchema.js";
import { ChannelService } from "./Channel/application/ChannelService.js";
import { ChannelController } from "./Channel/infrastructure/ChannelController.js";

import { GuildModel } from "./Guild/intrastructure/GuildSchema.js";
import { GuildService } from "./Guild/application/GuildService.js";
import { GuildController } from "./Guild/intrastructure/GuildController.js";


const main = async () => {
    await Database.connect()

    const guildRepository = new MongoRepository(GuildModel)
    const guildService = new GuildService(guildRepository)
    const guildController = new GuildController(guildService)

    const channelRepository = new MongoRepository(ChannelModel)
    const channelService = new ChannelService(channelRepository)
    const channelController = new ChannelController(channelService)
    
    const controllers = {
        guildController,
        channelController
    }

    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.DirectMessages
        ],
    })

    const discordAdapter = new DiscordAdapter({
        client: client, 
        token: Config.discord.token,
        controllers: controllers
    })
    
    await discordAdapter.start()
}

main()