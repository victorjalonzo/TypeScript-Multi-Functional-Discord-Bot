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

            const roleProductsResult = await this.roleproductService.getAll(paypoint.id)
            if (!roleProductsResult.isSuccess()) throw roleProductsResult.error

            const roleProducts = roleProductsResult.value
            if (roleProducts.length === 0) throw new RoleProductsNotFoundError()

            const casualPaymentMethodsResult = await this.casualPaymentService.getAll(guild.id)
            if (!casualPaymentMethodsResult.isSuccess()) throw casualPaymentMethodsResult.error

            const casualPaymentMethods = casualPaymentMethodsResult.value
            if (casualPaymentMethods.length === 0) throw new MissingCasualPaymentMethodsError()

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

            const result = await this.service.get(guildId)
            if (!result.isSuccess()) throw result.error

            const paypoint = result.value

            const roleProductsResult = await this.roleproductService.getAll(paypoint.id)
            if (!roleProductsResult.isSuccess()) throw roleProductsResult.error

            const roleProducts = roleProductsResult.value
            if (roleProducts.length === 0) throw new RoleProductsNotFoundError()
            
            const title = "Products list"

            let description: string = ""

            roleProducts.forEach(roleProduct => {
                description += InlineBlockText(`${roleProduct.role.name} (${roleProduct.role.id}) - ${roleProduct.price} USD`)
            })
            
            return await EmbedResult.info({interaction, title, description})
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

            let paypoint: IPaypoint

            const result = await this.service.get(guildId)

            if (!result.isSuccess()) {
                const newPaypoint = new Paypoint({guild, guildId})

                const newPaypointResult = await this.service.create(newPaypoint)
                if (!newPaypointResult.isSuccess()) throw newPaypointResult.error

                paypoint = newPaypointResult.value
            }
            else {
                paypoint = result.value
            }

            const roleResult = await this.roleService.get(role.id, guildId)
            if (!roleResult.isSuccess()) throw roleResult.error

            const roleParsed = roleResult.value

            let mediaBuffer: Buffer | undefined
            let mediaFilename: string | undefined

            if (media) {
                mediaBuffer = await getBufferFromAttachment(media)
                mediaFilename = media.name
            }

            const roleProduct = new RoleProduct({
                id: role.id,
                role: roleParsed, 
                price: price, 
                media: mediaBuffer,
                mediaFilename: mediaFilename,
                description: description,
                paypoint: paypoint,
                paypointId: paypoint.id
            })

            const resultRoleProduct = await this.roleproductService.create(roleProduct)
            if (!resultRoleProduct.isSuccess()) throw resultRoleProduct.error

            const title = "Product added"
            const info = InlineBlockText(`product: ${role.name} (${role.id})\nprice: ${price}`)
            const content = `The product was added to the paypoint: ${info}`

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

            const title = "Product removed"
            const info = InlineBlockText(`product: ${role.name} (${role.id})`)
            const description = `The product was removed from the paypoint successfully: ${info}`

            return await EmbedResult.success({title, description, interaction: interaction})
        }
        catch(e){
            logger.warn(e)
            return await EmbedResult.fail({description: InlineBlockText(String(e)), interaction: interaction})
        }
    }
}