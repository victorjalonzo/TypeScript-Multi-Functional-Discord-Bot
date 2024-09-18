import { IPaypointInput } from "../domain/IPaypointInput.js";
import { IRoleProductInput } from "../../RoleProduct/domain/IRoleProductInput.js";
import { Paypoint } from "../domain/Paypoint.js";
import { Attachment, AttachmentBuilder, ChatInputCommandInteraction } from "discord.js";
import { cache }  from "../../shared/intraestructure/Cache.js";
import { EmbedResult } from "../../shared/intraestructure/EmbedResult.js";
import { InlineBlockText } from "../../shared/utils/textFormating.js";
import { logger } from "../../shared/utils/logger.js";

import { IPaypoint, TPaymentMethodType } from "../domain/IPaypoint.js";

import { createGuildMenuEmbed } from "./Embeds/GuildMenuEmbed.js";
import { ICasualPaymentInput } from "../../CasualPayment/domain/ICasualPaymentInput.js";
import { CachedGuildNotFoundError } from "../../shared/domain/CachedGuildException.js";
import { GuildNotFoundError } from "../../shared/domain/Exceptions.js";

import { 
    MissingCasualPaymentMethodsError, 
    PaymentMethodNotProvidedError, 
    PaypointPaymentMethodNotChosenError, 
    PaypointProductTypeNotChosenError, 
} from "../domain/PaypointExceptions.js";

import { getBufferFromAttachment } from "../../shared/utils/AttachmentBuffer.js";
import { IGuildInput } from "../../Guild/domain/IGuildInput.js";
import { ICreditProductInput } from "../../CreditProduct/domain/ICreditProductInput.js";
import { RoleProductsNotFound } from "../../RoleProduct/domain/RoleProductExceptions.js";
import { CreditProductsNotFoundError } from "../../CreditProduct/domain/CreditProductExceptions.js";
import { TProductType } from "../../shared/domain/TProductType.js";
import { IProduct } from "../../shared/domain/IProduct.js";

export class PaypointCommandActions {
    constructor (
        private service: IPaypointInput,
        private guildService: IGuildInput,
        private roleproductService: IRoleProductInput,
        private creditProductService: ICreditProductInput,
        private casualPaymentService: ICasualPaymentInput
    ) {}

    execute = async (interaction: ChatInputCommandInteraction) => {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'create') return await this.create(interaction)
        if (subcommand === 'set') return await this.set(interaction)
    }

    create = async (interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply()

        try {
            const guild = interaction.guild
            if (!guild) throw new GuildNotFoundError()

            const guildCachedResult = await this.guildService.get(guild.id)
            if (!guildCachedResult.isSuccess()) throw guildCachedResult.error

            const result = await this.service.get(guild.id)
            if (!result.isSuccess()) throw result.error

            const paypoint = result.value

            if (!paypoint.paymentMethod) throw new PaypointPaymentMethodNotChosenError()
            if (!paypoint.productType) throw new PaypointProductTypeNotChosenError()

            let products: IProduct[]

            if (paypoint.productType === 'Credit') {
                const creditProductsResult = await this.creditProductService.getAll(guild.id)
                if (!creditProductsResult.isSuccess()) throw creditProductsResult.error
                if (creditProductsResult.value.length === 0) throw new CreditProductsNotFoundError()
    
                products = creditProductsResult.value.map(product => {
                    return {
                        id: product.id,
                        price: product.price,
                        name: product.name
                    }
                })
            }
            else {
                const roleProductsResult = await this.roleproductService.getAll(guild.id)
                if (!roleProductsResult.isSuccess()) throw roleProductsResult.error
                if (roleProductsResult.value.length === 0) throw new RoleProductsNotFound()

                products = roleProductsResult.value.map(product => {
                    return {
                        id: product.id,
                        price: product.price,
                        name: product.role.name
                    }
                })
            }

            const casualPaymentMethodsResult = await this.casualPaymentService.getAll(guild.id)
            if (!casualPaymentMethodsResult.isSuccess()) throw casualPaymentMethodsResult.error
            if (casualPaymentMethodsResult.value.length === 0) throw new MissingCasualPaymentMethodsError()

            const casualPaymentMethods = casualPaymentMethodsResult.value

            let media: AttachmentBuilder | undefined = undefined

            if (paypoint.media) {
                const buffer = paypoint.media
                media = new AttachmentBuilder(buffer, {name: `media.${paypoint.mediaCodec}`})
            }

            const {embed, selectRow, files, } = await createGuildMenuEmbed({
                title: paypoint.title, 
                description: paypoint.description,
                media: media,
                products: products,
                casualPaymentMethods: casualPaymentMethods
            })

            const message =  await interaction.editReply({
                embeds: [embed],
                components: [<any>selectRow], 
                files: files
            })

            paypoint.channelId = message.channelId
            paypoint.messageId = message.id
            
            await this.service.update(paypoint)
        }
        catch(e) {
            return await EmbedResult.fail({description: InlineBlockText(String(e)), interaction})
        }
    }

    set = async (interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply({ephemeral: true})

        try {
            const paymentMethod = <TPaymentMethodType>interaction.options.getString('payment-method')
            const productType = <TProductType>interaction.options.getString('product-type')
            const title = interaction.options.getString('title')
            const description = interaction.options.getString('description')
            const media = interaction.options.getAttachment('media')
    
            if (!paymentMethod) throw new PaymentMethodNotProvidedError()
    
            const guildId = interaction.guildId
            if (!guildId) throw new GuildNotFoundError()

            const cachedGuildResult = await this.guildService.get(guildId)
            if (!cachedGuildResult.isSuccess()) throw cachedGuildResult.error

            const cachedGuild = cachedGuildResult.value
    
            const resultPaypoint = await this.service.get(guildId)

            const paypoint = resultPaypoint.isSuccess() 
            ? resultPaypoint.value 
            : new Paypoint({
                guild: cachedGuild, 
                guildId: cachedGuild.id, 
                paymentMethod: paymentMethod,
                productType: productType
            })
    
            paypoint.paymentMethod = paymentMethod
            paypoint.productType = productType
    
            if (title) paypoint.title = title
            if (description) paypoint.description = description

            if (media) {
                paypoint.media = await getBufferFromAttachment(media)
                paypoint.mediaCodec = media.name.split('.').pop()
            }
    
            const resultPaypointCreated = await this.service.create(paypoint)
            if (!resultPaypointCreated.isSuccess()) throw resultPaypointCreated.error

            await EmbedResult.success({interaction, 
                title: 'Configuration updated', 
                description: InlineBlockText('The Configuration have been updated correctly')
            })

            logger.info("The paypoint configuration was updated")
        }
        catch(e) {
            await EmbedResult.fail({interaction, description: String(e)})
            logger.warn(String(e))
        }
    }
}