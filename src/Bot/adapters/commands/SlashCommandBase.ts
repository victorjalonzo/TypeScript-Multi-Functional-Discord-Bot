import { SlashCommandBuilder, CommandInteraction } from "discord.js"

export class BaseSlashCommand extends SlashCommandBuilder {
    private callbackFn: null | ((interaction: CommandInteraction) => Promise<void>) = null;

    setCallback(callback: (interaction: CommandInteraction) => Promise<void>) {
        this.callbackFn = callback;
        return this;
    }

    async execute(interaction: CommandInteraction): Promise<unknown>{
        if (this.callbackFn) return await this.callbackFn(interaction);
    }
}