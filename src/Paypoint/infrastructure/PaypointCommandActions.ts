import { IPaypointInput } from "../domain/IPaypointInput.js";
import { Paypoint } from "../domain/Paypoint.js";
import { ChatInputCommandInteraction } from "discord.js";
import { cache }  from "../../shared/intraestructure/Cache.js";
import { EmbedResult } from "../../shared/intraestructure/EmbedResult.js";
import { InlineBlockText } from "../../shared/utils/textFormating.js";
import { logger } from "../../shared/utils/logger.js";

import { TPaymentMethodType } from "../domain/IPaypoint.js";
import { TSaleType } from "../domain/IPaypoint.js";

import { createGUI } from "./Embeds/Menu.js";
import { ICreditInput } from "../../Credit/domain/ICreditInput.js";
import { ICasualPaymentInput } from "../../CasualPayment/domain/ICasualPaymentInput.js";

export class PaypointCommandActions {
    constructor (
        private service: IPaypointInput,
        private creditService: ICreditInput,
        private casualPaymentService: ICasualPaymentInput
    ) {}

    execute = async (interaction: ChatInputCommandInteraction) => {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'create') return await this.create(interaction)
        if (subcommand === 'remove') return await this.remove(interaction)
    }

    create = async (interaction: ChatInputCommandInteraction) => {
        try {
            const sale_type = <TSaleType>interaction.options.getString('sale_type')
            const payment_method_type = <TPaymentMethodType>interaction.options.getString('payment_method_type')
            const title = interaction.options.getString('title')
            const description = interaction.options.getString('description')
            const image = interaction.options.getAttachment('image')
            const guildId = interaction.guildId
    
            if (!guildId || !sale_type || !payment_method_type || !title || !description || !image) return
    
            const cachdGuild = cache.get(guildId)
            if (!cachdGuild) return new Error("Guild not found")

            const creditsResult = await this.creditService.getAll({guildId})
            
            if (!creditsResult.isSuccess()) return new Error(creditsResult.error)
            if (creditsResult.value.length === 0) return new Error("The guild must have at least one credit/role package")

            const credits = creditsResult.value

            const casualPaymentMethodsResult = await this.casualPaymentService.getAll(guildId)
            if (!casualPaymentMethodsResult.isSuccess()) return new Error(casualPaymentMethodsResult.error)
            if (casualPaymentMethodsResult.value.length === 0) return new Error("The guild must have at least one casual/integrated payment method")
            
            const casualPaymentMethods = casualPaymentMethodsResult.value
    
            const imageURL = image.url
    
            const paypoint = new Paypoint(imageURL, title, description, payment_method_type, sale_type, guildId, cachdGuild);
            
            const result = await this.service.create(paypoint)
    
            if (!result.isSuccess()) return new Error(result.error)

            const {embed, buttonRow, files} = await createGUI({title, description, image, credits, casualPaymentMethods})

            return await interaction.channel?.send({
                embeds: [embed],
                components: [<any>buttonRow], 
                files: files
            })
        }
        catch (e) {
            logger.warn(e)
            return await EmbedResult.fail({description: InlineBlockText(String(e)), interaction: interaction})
        }
    }

    remove = async (interaction: ChatInputCommandInteraction) => {}
}