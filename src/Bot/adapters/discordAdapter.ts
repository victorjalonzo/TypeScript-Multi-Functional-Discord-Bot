import { Client, BaseInteraction, CategoryChannel } from 'discord.js'
import { CommandHandler } from './CommandHandler.js';
import { ButtonHandler } from './ButtonHandler.js';
import { TextChannel, VoiceChannel } from 'discord.js';
import { logger } from '../../shared/utils/logger.js';
import { Controllers } from '../../shared/intraestructure/Container.js';

interface IProps {
  client: Client
  token: string | undefined
}

export class DiscordAdapter {
    private client: Client;
    private token: string | undefined;
    private commandHandler: CommandHandler;
    private buttonHandler: ButtonHandler
    private controllers: typeof Controllers
  
    constructor({client, token}: IProps) {

      if (!client) throw new Error('Missing client');
      if (!token) throw new Error('Missing bot token');

      this.token = token;
      this.client = client;
      this.commandHandler = new CommandHandler({client: this.client, token: this.token});
      this.buttonHandler = new ButtonHandler();
      this.controllers = Controllers
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
            await this.controllers.memberController.create(member)
            await this.controllers.inviteEventController.increaseInviteCount(member)
            await this.controllers.rewardRoleEventController.giveReward(member)
        })
        this.client.on('GuildMemberUpdate', async (oldMember, newMember) => {
            return await this.controllers.memberController.update(oldMember, newMember)
        })
        this.client.on('GuildMemberRemove', async (member) => {
            return await this.controllers.memberController.delete(member)
        })

        this.client.on('channelCreate', async (channel) => {
          if (channel instanceof TextChannel) {
            return await this.controllers.textChannelEventController.createRecord(channel)
          }
          if (channel instanceof VoiceChannel) {
            return await this.controllers.voiceChannelEventController.createRecord(channel)
          }
          if (channel instanceof CategoryChannel) {
            return await this.controllers.categoryChannelEventController.createRecord(channel)
          }

        })
        this.client.on('channelUpdate', async (oldChannel, newChannel) => {
          if (oldChannel instanceof TextChannel && newChannel instanceof TextChannel) {
            return await this.controllers.textChannelEventController.updateRecord(oldChannel, newChannel)
          }
          if (oldChannel instanceof VoiceChannel && newChannel instanceof VoiceChannel) {
            return await this.controllers.voiceChannelEventController.updateRecord(oldChannel, newChannel)
          }
          if (oldChannel instanceof CategoryChannel && newChannel instanceof CategoryChannel) {
            return await this.controllers.categoryChannelEventController.updateRecord(oldChannel, newChannel)
          }

        })
        this.client.on('channelDelete', async (channel) => {
          if (channel instanceof TextChannel) {
            return await this.controllers.textChannelEventController.deleteRecord(channel)
          }
          if (channel instanceof VoiceChannel) {
            return await this.controllers.voiceChannelEventController.deleteRecord(channel)
          }
          if (channel instanceof CategoryChannel) {
            return await this.controllers.categoryChannelEventController.deleteRecord(channel)
          }
        })

        this.client.on('roleCreate', async (role) => {
          return await this.controllers.roleEventController.create(role)
        })
        this.client.on('roleUpdate', async (oldRole, newRole) => {
          return await this.controllers.roleEventController.update(oldRole, newRole)
        })
        this.client.on('roleDelete', async (role) => {
          return await this.controllers.roleEventController.delete(role)
        })
    }
  }