import { DiscordAdapter } from "./Bot/adapters/discordAdapter.js";
import { Client, GatewayIntentBits, Partials } from "discord.js";
import { Config } from './shared/config/config.js'

const main = async () => {
    const client = new Client({
        intents: [
            GatewayIntentBits.DirectMessageReactions,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildInvites,
            GatewayIntentBits.MessageContent
        ],
        partials: [
            Partials.Channel,
            Partials.Message,
        ]
    })

    const discordAdapter = new DiscordAdapter({
        client: client, 
        token: Config.discord.token
    })
    
    await discordAdapter.start()
}

main()