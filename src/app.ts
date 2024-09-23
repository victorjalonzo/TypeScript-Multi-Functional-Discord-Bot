import { DiscordAdapter } from "./Bot/adapters/discordAdapter.js";
import { Client, GatewayIntentBits, Partials } from "discord.js";
import { Config } from './shared/config/config.js'
import express from 'express'
import { Routers } from "./shared/intraestructure/Container.js";

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

    const app = express()
    
    app.use(express.json())

    app.use((req, res, next) => {
        req.discordClient = client;
        next();
    });

    app.use('/api/v1', Routers.casualPaymentRouter)
    app.use('/', Routers.inviteCodeRouter)
    
    
    app.listen(3000, () => console.log('listening on port 3000'))
}

main()
