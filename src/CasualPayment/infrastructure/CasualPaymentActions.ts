import { ChatInputCommandInteraction } from "discord.js";
import { logger } from "../../shared/utils/logger.js";
import { cache }  from "../../shared/intraestructure/Cache.js";
import { CasualPayment } from "../domain/CasualPayment.js";
import { TPaymentMethods } from "../domain/ICasualPayment.js";
import { ICasualPaymentInput } from "../domain/ICasualPaymentInput.js";

export class CasualPaymentActions {
    constructor (private service: ICasualPaymentInput) {}

    execute = async (interaction: ChatInputCommandInteraction): Promise<void> => {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'list')  await this.list(interaction)
        else if (subcommand === 'add')  await this.add(interaction)
        else if (subcommand === 'remove')  await this.remove(interaction)
    }

    list = async (interaction: ChatInputCommandInteraction) => {}

    add = async (interaction: ChatInputCommandInteraction) => {
        try {
            const method = <TPaymentMethods> interaction.options.getString('name')
            const value = interaction.options.getString('value')
            const guildId = interaction.guildId

            if (!method || !value || !guildId) return

            const guild = cache.get(guildId);
            const casualPayment = new CasualPayment(method, value, guild);

            const result = await this.service.create(casualPayment)
            
            let content = ""

            if (result.isSuccess()) {
                content = "The casual payment method was added successfully\n"
                content += `Name: ${result.value?.name}\nValue: ${result.value?.value}`
                return await interaction.reply({content: content, ephemeral: true})
            }
            else {
                content = "The casual payment method could not be added"
                return await interaction.reply({content: content, ephemeral: true})
            }
        }
        catch (e) {
            await interaction.reply({
                content: "Something went wrong...", 
                ephemeral: true
            })
            logger.warn(e)
        }
    }

    remove = async (interaction: ChatInputCommandInteraction) => {
        const name = interaction.options.getString('name')
    }
}