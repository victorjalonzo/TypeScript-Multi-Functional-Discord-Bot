import { Client, BaseInteraction } from 'discord.js'
import { CommandHandler } from './CommandHandler.js';
import { ButtonHandler } from './ButtonHandler.js';
import { TextChannel, VoiceChannel } from 'discord.js';
import { logger } from '../../shared/utils/logger.js';

interface IProps {
  client: Client
  token: string | undefined
  controllers: Record<string,any>
}

export class DiscordAdapter {
    private client: Client;
    private token: string | undefined;
    private commandHandler: CommandHandler;
    private buttonHandler: ButtonHandler
    private controllers : Record<string,any>
  
    constructor({client, token, controllers}: IProps) {

      if (!client) throw new Error('Missing client');
      if (!token) throw new Error('Missing bot token');
      if (!controllers) throw new Error('Missing controllers');

      this.token = token;
      this.client = client;
      this.commandHandler = new CommandHandler({client: this.client, token: this.token});
      this.buttonHandler = new ButtonHandler();
      this.controllers = controllers
    }

    async start(): Promise<void> {
        await this.client.login(this.token)
        await this.setupEventHandlers();
        await this.registerCommands();
    }

    async registerCommands(): Promise<void> {
      await this.commandHandler.registerCommands();
    }
  
    async setupEventHandlers(): Promise<void> {
        this.client.on('ready', async () => {
            logger.info(`Logged in as ${this.client.user?.tag}!`);

            const guildManager = this.client.guilds
            await this.controllers.guildController.createCache(guildManager)
        })

        this.client.on('interactionCreate', async (interaction: BaseInteraction) => {
            if (interaction.isChatInputCommand()) return await this.commandHandler.handle(interaction);
            if (interaction.isButton()) return await this.buttonHandler.handle(interaction);

            return logger.warn(`Unknow interaction received... ${interaction}`)
        });

        this.client.on('guildMemberAdd', async (member) => {
            return await this.controllers.memberController.createMember(member)
        })

        this.client.on('channelCreate', async (channel) => {
          if(channel instanceof TextChannel || channel instanceof VoiceChannel){
            return await this.controllers.channelController.createChannel(channel)
          }
        })

        this.client.on('channelUpdate', async (oldChannel, newChannel) => {
          if ((oldChannel instanceof TextChannel || oldChannel instanceof VoiceChannel) && (newChannel instanceof TextChannel || newChannel instanceof VoiceChannel)) {
            return await this.controllers.channelController.updateChannel(oldChannel, newChannel);
          }
        })

        this.client.on('channelDelete', async (channel) => {
          if (channel instanceof TextChannel || channel instanceof VoiceChannel) {
            return await this.controllers.channelController.deleteChannel(channel)
          }
        })
    }
  }