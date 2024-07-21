import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js"

export class SlashCommandCallable extends SlashCommandBuilder {
    private callbackFn: null | ((interaction: ChatInputCommandInteraction) => Promise<unknown>) = null;

    setCallback(callback: (interaction: ChatInputCommandInteraction) => Promise<unknown>) {
        this.callbackFn = callback;
        return this;
    }

    async execute(interaction: ChatInputCommandInteraction): Promise<unknown>{
        if (this.callbackFn) return await this.callbackFn(interaction);
    }
}