import { DiscordAdapter } from "./Bot/adapters/discordAdapter.js";
import { Client, GatewayIntentBits } from "discord.js";
import { Config } from './shared/config/config.js'
import { Database } from "./shared/intraestructure/database.js";

const main = async () => {
    await Database.connect()

    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.DirectMessages
        ],
    })

    const discordAdapter = new DiscordAdapter({
        client: client, 
        token: Config.discord.token
    })
    
    await discordAdapter.start()
}

main()