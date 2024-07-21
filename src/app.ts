import { DiscordAdapter } from "./Bot/adapters/discordAdapter.js";
import { Client, GatewayIntentBits } from "discord.js";
import { Config } from './shared/config/config.js'
import { Controllers } from "./shared/intraestructure/Container.js";

const main = async () => {
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.DirectMessages
        ],
    })

    const discordAdapter = new DiscordAdapter({
        client: client, 
        token: Config.discord.token,
        controllers: Controllers
    })
    
    await discordAdapter.start()
}

main()