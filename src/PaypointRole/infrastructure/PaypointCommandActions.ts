import { IPaypointInput } from "../domain/IPaypointInput.js";
import { IRoleProductInput } from "../../RoleProduct/domain/IRoleProductInput.js";
import { Paypoint } from "../domain/Paypoint.js";
import { Attachment, AttachmentBuilder, ChatInputCommandInteraction } from "discord.js";
import { cache }  from "../../shared/intraestructure/Cache.js";
import { EmbedResult } from "../../shared/intraestructure/EmbedResult.js";
import { InlineBlockText } from "../../shared/utils/textFormating.js";
import { logger } from "../../shared/utils/logger.js";

import { IPaypoint, TPaymentMethodType } from "../domain/IPaypointRole.js";

import { createGuildMenuEmbed } from "./Embeds/GuildMenuEmbed.js";
import { ICreditInput } from "../../Credit/domain/ICreditInput.js";
import { ICasualPaymentInput } from "../../CasualPayment/domain/ICasualPaymentInput.js";
import { CachedGuildNotFoundError } from "../../shared/domain/CachedGuildException.js";
import { GuildNotFoundError } from "../../shared/domain/Exceptions.js";

import { Role as DiscordRole } from "discord.js";

import { 
    InvalidRoleProductPriceError, 
    MissingCasualPaymentMethodsError, 
    PaymentMethodNotProvidedError, 
    PaypointNotFoundError, 
    PaypointPaymentMethodNotChosenError, 
    RoleProductNotPrividedError, 
    RoleProductPriceNotPrividedError, 
    RoleProductsNotFoundError 
} from "../domain/PaypointExceptions.js";
import { RoleProduct } from "../../RoleProduct/domain/RoleProduct.js";
import { IRoleInput } from "../../Role/domain/IRoleInput.js";
import { getBufferFromAttachment } from "../../shared/utils/AttachmentBuffer.js";

export class PaypointCommandActions {
    constructor (
        private service: IPaypointInput,
        private roleService: IRoleInput,
        private roleproductService: IRoleProductInput,
        private casualPaymentService: ICasualPaymentInput
    ) {}

    execute = async (interaction: ChatInputCommandInteraction) => {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'create') return await this.create(interaction)
        if (subcommand === 'set') return await this.set(interaction)
        if (subcommand === 'products-list') return await this.productsList(interaction)
        if (subcommand === 'add-product') return await this.addProduct(interaction)
        if (subcommand === 'remove-product') return await this.removeProduct(interaction)
    }

    create = async (interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply()

        try {
            const guild = interaction.guild
            if (!guild) throw new GuildNotFoundError()

            const cachedGuild = cache.get(guild.id)
            if (!cachedGuild) throw new CachedGuildNotFoundError()

            const result = await this.service.get(guild.id)
            if (!result.isSuccess()) throw result.error

            const paypoint = result.value

            if (!paypoint.paymentMethod) throw new PaypointPaymentMethodNotChosenError()

            const roleProductsResult = await this.roleproductService.getAll(guild.id)
            if (!roleProductsResult.isSuccess()) throw roleProductsResult.error
            if (roleProductsResult.value.length === 0) throw new RoleProductsNotFoundError()

            const roleProducts = roleProductsResult.value

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
                products: roleProducts,
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
            const title = interaction.options.getString('title')
            const description = interaction.options.getString('description')
            const media = interaction.options.getAttachment('media')
    
            if (!paymentMethod) throw new PaymentMethodNotProvidedError()
    
            const guildId = interaction.guildId
            if (!guildId) throw new GuildNotFoundError()
    
            const guild = cache.get(guildId)
            if (!guild) throw new CachedGuildNotFoundError()
    
            let paypoint: IPaypoint
    
            const resultPaypoint = await this.service.get(guildId)
    
            if (!resultPaypoint.isSuccess()) {
                paypoint = new Paypoint({guild, guildId, paymentMethod})
            }
            else {
                paypoint = resultPaypoint.value
            }

            paypoint.paymentMethod = paymentMethod
    
            if (title) paypoint.title = title
            if (description) paypoint.description = description

            if (media) {
                paypoint.media = await getBufferFromAttachment(media)
                paypoint.mediaCodec = media.name.split('.').pop()
            }
    
            const resultPaypointCreated = await this.service.create(paypoint)
            if (!resultPaypointCreated.isSuccess()) throw resultPaypointCreated.error

            return await EmbedResult.success({interaction, 
                title: 'Configuration updated', 
                description: InlineBlockText('The Configuration have been updated correctly')
            })
        }
        catch(e) {
            return await EmbedResult.fail({interaction, description: String(e)})
        }
    }

    productsList = async (interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply({ephemeral: true})

        try {
            const guildId = interaction.guildId
            if (!guildId) throw new GuildNotFoundError()

            const guild = cache.get(guildId)
            if (!guild) throw new CachedGuildNotFoundError()

            const roleProductsResult = await this.roleproductService.getAll(guildId)
            if (!roleProductsResult.isSuccess()) throw roleProductsResult.error

            const roleProducts = roleProductsResult.value

            const title = "Product list"
            const thumbnail = "cart"
            let description: string = ""

            description = roleProducts.length === 0 
            ? InlineBlockText("There are no products") : 
            roleProducts.map(roleProduct => 
                InlineBlockText(`Product Name: ${roleProduct.role.name}\nProduct ID: ${roleProduct.role.id}\nProduct Price: ${roleProduct.price} USD`)).join('\n')
            
            return await EmbedResult.info({interaction, title, thumbnail, description})
        }
        catch(e) {
            return await EmbedResult.fail({interaction, description: String(e)})
        }
    }

    addProduct = async (interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply({ephemeral: true})

        try {
            const role = interaction.options.getRole('role')
            const price = interaction.options.getInteger('price')
            const media = interaction.options.getAttachment('media')
            const description = interaction.options.getString('description')

            if (!role) throw new RoleProductNotPrividedError()
            if (!price) throw new RoleProductPriceNotPrividedError()

            const guildId = interaction.guildId
            if (!guildId) throw new GuildNotFoundError()

            const guild = cache.get(guildId)
            if (!guild) throw new CachedGuildNotFoundError()

            if (price <= 0) throw new InvalidRoleProductPriceError()

            const roleResult = await this.roleService.get(role.id, guildId)
            if (!roleResult.isSuccess()) throw roleResult.error

            const roleCached = roleResult.value

            let mediaBuffer: Buffer | undefined
            let mediaFilename: string | undefined

            if (media) {
                mediaBuffer = await getBufferFromAttachment(media)
                mediaFilename = media.name
            }

            const roleProduct = new RoleProduct({
                id: role.id,
                role: roleCached, 
                price: price, 
                media: mediaBuffer,
                mediaFilename: mediaFilename,
                description: description,
                guild: guild,
                guildId: guildId,
            })

            const roleProductResult = await this.roleproductService.create(roleProduct)
            if (!roleProductResult.isSuccess()) throw roleProductResult.error

            const title = "Product added"
            const info = InlineBlockText(`Product Name: ${roleProduct.role.name}\nProduct ID: ${roleProduct.role.id}\nProduct Price: ${roleProduct.price} USD`)
            const content = `The product was added successfully.${info}`

            return await EmbedResult.success({title, description: content, interaction: interaction})
        }
        catch (e) {
            logger.warn(e)
            return await EmbedResult.fail({description: InlineBlockText(String(e)), interaction: interaction})
        }
    }

    removeProduct = async (interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply({ephemeral: true})

        try {
            const role = interaction.options.getRole('role')

            if (!role) throw new RoleProductNotPrividedError()

            const guildId = interaction.guildId
            if (!guildId) throw new GuildNotFoundError()
            
            const guild = cache.get(guildId)
            if (!guild) throw new CachedGuildNotFoundError()
            
            const result = await this.roleproductService.delete(role.id)
            if (!result.isSuccess()) throw result.error

            const roleProductDeleted = result.value

            const title = "Product removed"
            const info = InlineBlockText(`Product Name: ${roleProductDeleted.role.name}\nProduct ID: ${roleProductDeleted.role.id}\nProduct Price: ${roleProductDeleted.price} USD`)
            const description = `The product was removed from the guild successfully: ${info}`

            return await EmbedResult.success({title, description, interaction: interaction})
        }
        catch(e){
            logger.warn(e)
            return await EmbedResult.fail({description: InlineBlockText(String(e)), interaction: interaction})
        }
    }
}