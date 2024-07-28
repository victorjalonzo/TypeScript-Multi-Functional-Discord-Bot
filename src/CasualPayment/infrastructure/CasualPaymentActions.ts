import { ChatInputCommandInteraction } from "discord.js";
import { logger } from "../../shared/utils/logger.js";
import { cache }  from "../../shared/intraestructure/Cache.js";
import { CasualPayment } from "../domain/CasualPayment.js";
import { TPaymentMethods } from "../domain/ICasualPayment.js";
import { ICasualPaymentInput } from "../domain/ICasualPaymentInput.js";
import { ICachedGuild } from "../../shared/intraestructure/ICachedGuild.js";
import { SlashCommandAction } from "../../shared/intraestructure/SlashCommandAction.js";
import { EmbedResult } from "../../shared/intraestructure/EmbedResult.js";

import { 
    MethodNotProvidedError,
    ValueNotProvidedError,
    GuildNotFoundError
} from "../domain/CasualPaymentExceptions.js";
import { InlineBlockText } from "../../shared/utils/textFormating.js";

export class CasualPaymentActions extends SlashCommandAction {
    constructor (private service: ICasualPaymentInput) {
        super();
    }

    execute = async (interaction: ChatInputCommandInteraction): Promise<unknown> => {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'list') return await this.list(interaction)
        if (subcommand === 'add') return await this.add(interaction)
        if (subcommand === 'remove') return await this.remove(interaction)

        return await interaction.reply({content: "Unknown subcommand", ephemeral: true})
    }

    list = async (interaction: ChatInputCommandInteraction) => {
        try {
            if (!interaction.guildId) return

            const cachedGuild = cache.get(interaction.guildId)
            if (!cachedGuild) return
    
            const result = await this.service.getAll(cachedGuild.id)
            if (!result.isSuccess()) return new Error("It was not possible to get the list of casual payment methods")

            const title = "CURRENT METHOD LIST"
            let description: string = ""

            if (result.value.length === 0) {
                description = InlineBlockText("The list currently is empty.")
            }
            else {
                description = "" + result.value
                .map(casualPayment => InlineBlockText(`${casualPayment.name.toUpperCase()} : ${casualPayment.value.toUpperCase()}`))
                .join("")
            }

            const thumbnail = "casual-payment-list"

            return await EmbedResult.info({title, description, interaction, thumbnail})
        }
        catch (e) {
            logger.error(e)
            return await EmbedResult.fail({description: InlineBlockText(String(e)), interaction})
        }
    }

    add = async (interaction: ChatInputCommandInteraction) => {
        try {
            const method = <TPaymentMethods> interaction.options.getString('name')
            const value = interaction.options.getString('value')
            const guildId = interaction.guildId

            if (!method) throw new MethodNotProvidedError
            if (!value) throw new ValueNotProvidedError
            if (!guildId) throw new GuildNotFoundError

            const cachedGuild = cache.get(guildId);
            if (!cachedGuild) throw new GuildNotFoundError

            const casualPayment = new CasualPayment(method, value, cachedGuild.id, cachedGuild);

            const result = await this.service.create(casualPayment)

            if (!result.isSuccess()) throw new Error("The method could not be added as a casual payment method")

            cache.update(<ICachedGuild>result.value.guild)

            const title = "METHOD ADDED"

            let description = "The casual payment method was added successfully.\n"
            description += InlineBlockText(`${method.toLocaleUpperCase()} : ${value.toUpperCase()} 🟢`)

            const thumbnail = method.split(" ").join("").toLowerCase()

            return await EmbedResult.success({title, description, interaction, thumbnail})
        }
        catch (e) {
            logger.warn(e)
            return await EmbedResult.fail({description: InlineBlockText(String(e)), interaction})
        }
    }

    remove = async (interaction: ChatInputCommandInteraction) => {
        try {
            const method = <TPaymentMethods> interaction.options.getString('name')
            const guildId = interaction.guildId
    
            if (!method) throw new MethodNotProvidedError
            if (!guildId) throw new GuildNotFoundError
    
            const result = await this.service.delete({name: method, guildId: guildId})

            if (!result.isSuccess()) throw new Error(result.error)

            const title = "METHOD REMOVED"

            let description = "The casual payment method was removed successfully.\n"
            description += InlineBlockText(`${result.value.name.toUpperCase()} : ${result.value.value.toUpperCase()} 🔴`)

            const thumbnail = method.split(" ").join("").toLowerCase()

            return await EmbedResult.success({title, description, interaction, thumbnail})
        }
        catch (e) {
            logger.warn(e)
            return await EmbedResult.fail({description: InlineBlockText(String(e)), interaction})
        }
    }
}