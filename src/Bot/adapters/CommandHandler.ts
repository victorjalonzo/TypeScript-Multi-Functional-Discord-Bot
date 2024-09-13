import { SlashCommandCallable } from '../../shared/intraestructure/SlashCommandCallable.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { Client, ChatInputCommandInteraction } from 'discord.js';
import { Commands } from '../../shared/intraestructure/Container.js';
import { logger } from '../../shared/utils/logger.js';

export class CommandHandler {
  private commands: SlashCommandCallable[]
  private client: Client;
  private token: string;

  constructor({client, token}: {client:Client, token: string}) {
    this.token = token;
    this.client = client;

    this.commands = Commands;
  }

  async registerCommands(): Promise<void> {
      const commands = this.commands.map(command => (command.toJSON()));

      try {
        logger.info('Started refreshing application (/) commands.');

        const guilds = ["1096621006686277662", "1099129970577645600"]

        guilds.forEach(async guildId => {
          await this.register({commands: commands, guildId: guildId });
        })
  
        logger.info('Successfully reloaded application (/) commands.');
      } catch (error) {
        logger.warn(error);
      }
  }

  async register ({commands, guildId}: {commands: Record<string, any>[], guildId?: string}): Promise<unknown> {
    const rest = new REST({ version: '10' }).setToken(this.token);
    let route;

    if (guildId) {
      route = Routes.applicationGuildCommands(this.client.user!.id, guildId);
    } 
    else {
      route = Routes.applicationCommands(this.client.user!.id);
    }
    
    return await rest.put(route, { body: commands});
  }

  async handle(interaction: ChatInputCommandInteraction): Promise<void> {
    const command = this.commands.find(cmd => cmd.name === interaction.commandName);
    if (command) {
      await command.execute(interaction);
    }
  }
}