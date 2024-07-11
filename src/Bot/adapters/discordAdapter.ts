import { Client, Interaction } from 'discord.js'
import { CommandHandler } from './commands/CommandHandler.js';
import controllers from './Controllers.js';
import { TextChannel, VoiceChannel } from 'discord.js';

export class DiscordAdapter {
    private client: Client;
    private token: string
    private commandHandler: CommandHandler;
    private controllers: Record<string,any>
  
    constructor({client, token}: {client: Client, token: string | undefined}) {

      if (!client || !token) {
        throw new Error('Missing client or bot token');
      }

      this.token = token;
      this.client = client;
      this.commandHandler = new CommandHandler({client: this.client, token: this.token});
      this.controllers = controllers
    }

    async start(): Promise<void> {
        await this.client.login(this.token)
        await this.registerCommands();
        await this.setupEventHandlers();
    }

    async registerCommands(): Promise<void> {
      await this.commandHandler.registerCommands();
    }
  
    async setupEventHandlers(): Promise<void> {
        this.client.on('ready', async () => {
            console.log(`Logged in as ${this.client.user?.tag}!`);
        })

        this.client.on('interactionCreate', async (interaction: Interaction) => {
            if (interaction.isCommand()) {
                await this.commandHandler.handle(interaction);
            }
        });

        this.client.on('channelCreate', async (channel) => {
          if(channel instanceof TextChannel || channel instanceof VoiceChannel){
            return await controllers.channelController.createChannel(channel)
          }
        })

        this.client.on('channelUpdate', async (oldChannel, newChannel) => {
          if ((oldChannel instanceof TextChannel || oldChannel instanceof VoiceChannel) && (newChannel instanceof TextChannel || newChannel instanceof VoiceChannel)) {
            return await controllers.channelController.updateChannel(oldChannel, newChannel);
          }
        })

        this.client.on('channelDelete', async (channel) => {
          if (channel instanceof TextChannel || channel instanceof VoiceChannel) {
            return await controllers.channelController.deleteChannel(channel)
          }
        })
    }
  }