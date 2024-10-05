import { IPaypointInput } from "../domain/IPaypointInput.js";
import { IRoleProductInput } from "../../RoleProduct/domain/IRoleProductInput.js";
import { Paypoint } from "../domain/Paypoint.js";
import { Attachment, AttachmentBuilder, ChannelType, ChatInputCommandInteraction, TextChannel } from "discord.js";
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
import { CreditProduct } from "../../CreditProduct/domain/CreditProduct.js";
import { RoleProduct } from "../../RoleProduct/domain/RoleProduct.js";
import { ProductType } from "../../shared/domain/ProductTypeEnums.js";
import { TextChannelNotFoundError } from "../../TextChannel/domain/TextChannelExceptions.js";
import { PaypointMessage } from "./PaypointMessage.js";

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
        await interaction.deferReply({ ephemeral: true })

        try {
            const guild = interaction.guild
            if (!guild) throw new GuildNotFoundError()

            const channel = interaction.channel
            if (!channel) throw new TextChannelNotFoundError()

            if (channel.type !== ChannelType.GuildText) throw new Error('The channel must be a text channel')

            await PaypointMessage.create({
                guildId: guild.id,
                channel: channel,
                service: this.service,
                roleProductService: this.roleproductService,
                creditProductService: this.creditProductService,
                casualPaymentMethodService: this.casualPaymentService
            })

            await EmbedResult.success({interaction, 
                title: "Paypoint created", 
                description: InlineBlockText("The paypoint has been created successfully")
            })

            logger.info(`Paypoint created in ${guild.name} (${guild.id})`)
        }
        catch(e) {
            return await EmbedResult.fail({description: InlineBlockText(String(e)), interaction})
        }
    }

    set = async (interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply({ephemeral: true})

        try {
            const paymentMethod = <TPaymentMethodType>interaction.options.getString('payment-method')
            const productType = <ProductType>interaction.options.getString('product-type')
            const title = interaction.options.getString('title')
            const description = interaction.options.getString('description')
            const media = interaction.options.getAttachment('media')
    
            if (!paymentMethod) throw new PaymentMethodNotProvidedError()
    
            const guildId = interaction.guildId
            if (!guildId) throw new GuildNotFoundError()

            const guildRecord = await this.guildService.get(guildId)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

            const paypoint = await this.service.get(guildId)
            .then(r => r.isSuccess() ? r.value : new Paypoint({
                guild: guildRecord, 
                guildId: guildRecord.id, 
                paymentMethod: paymentMethod,
                productType: productType
            }))
    
            paypoint.paymentMethod = paymentMethod
            paypoint.productType = productType
    
            if (title) paypoint.title = title
            if (description) paypoint.description = description

            if (media) {
                paypoint.media = await getBufferFromAttachment(media)
                paypoint.mediaCodec = media.name.split('.').pop()
            }
    
            await this.service.create(paypoint)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

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