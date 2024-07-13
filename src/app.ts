import { DiscordAdapter } from "./Bot/adapters/discordAdapter.js";
import { Client, GatewayIntentBits } from "discord.js";
import { Config } from './shared/config/config.js'
import { Database } from "./shared/intraestructure/database.js";

import { ChannelService } from "./Channel/application/ChannelService.js";
import { MongoChannelRepository } from "./Channel/infrastructure/MongoChannelRepository.js";
import { ChannelController } from "./Channel/infrastructure/ChannelController.js";

const main = async () => {
    await Database.connect()

    const channelRepository = new MongoChannelRepository()
    
    const channelService = new ChannelService(channelRepository)
    const channelController = new ChannelController(channelService)
    
    const controllers = {
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