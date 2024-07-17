import { RichSlashCommand } from '../../shared/intraestructure/RichSlashCommand.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { Client } from 'discord.js';
import { ChatInputCommandInteraction } from 'discord.js';

import { availableCommands } from './AvailableCommands.js';

export class CommandHandler {
  private commands: RichSlashCommand[]
  private client: Client;
  private token: string;

  constructor({client, token}: {client:Client, token: string}) {
    this.token = token;
    this.client = client;

    this.commands = availableCommands;
  }

  async registerCommands(): Promise<void> {
      const commands = this.commands.map(command => (command.toJSON()));
      console.log(commands)

      try {
        console.log('Started refreshing application (/) commands.');

        await this.register({commands: commands, guildId: "1096621006686277662" });
  
        console.log('Successfully reloaded application (/) commands.');
      } catch (error) {
        console.error(error);
      }
  }

  async registerDMCommands(): Promise<void> {}
  async registerGuildCommands(): Promise<void> {}

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