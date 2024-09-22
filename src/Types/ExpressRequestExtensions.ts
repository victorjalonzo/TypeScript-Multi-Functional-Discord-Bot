import { Client } from 'discord.js';

declare global {
    namespace Express {
        interface Request {
            discordClient?: Client;
        }
    }
}