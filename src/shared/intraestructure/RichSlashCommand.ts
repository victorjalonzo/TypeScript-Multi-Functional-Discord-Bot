import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js"

export class RichSlashCommand extends SlashCommandBuilder {
    private callbackFn: null | ((interaction: ChatInputCommandInteraction) => Promise<void>) = null;

    setCallback(callback: (interaction: ChatInputCommandInteraction) => Promise<void>) {
        this.callbackFn = callback;
        return this;
    }

    async execute(interaction: ChatInputCommandInteraction): Promise<unknown>{
        if (this.callbackFn) return await this.callbackFn(interaction);
    }
}