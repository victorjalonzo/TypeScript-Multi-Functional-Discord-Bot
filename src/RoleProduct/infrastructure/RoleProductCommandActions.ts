import { ChatInputCommandInteraction } from "discord.js";
import { IRoleProductInput } from "../domain/IRoleProductInput.js";
import { GuildNotFoundError } from "../../shared/domain/Exceptions.js";
import { IGuildInput } from "../../Guild/domain/IGuildInput.js";
import { InlineBlockText } from "../../shared/utils/textFormating.js";
import { EmbedResult } from "../../shared/intraestructure/EmbedResult.js";
import { getBufferFromAttachment } from "../../shared/utils/AttachmentBuffer.js";
import { RoleProduct } from "../domain/RoleProduct.js";
import { logger } from "../../shared/utils/logger.js";
import { IRoleInput } from "../../Role/domain/IRoleInput.js";
import { RoleProductInvalidPriceError, RoleProductNotPrividedError, RoleProductPriceNotPrividedError } from "../domain/RoleProductExceptions.js";

export class RoleProductCommandActions {
    constructor (
        private service: IRoleProductInput,
        private guildService: IGuildInput,
        private roleService: IRoleInput
    ) {}

    execute = async (interaction: ChatInputCommandInteraction): Promise<unknown> => {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'list') return await this.list(interaction)
        if (subcommand === 'add') return await this.add(interaction)
        if (subcommand === 'remove') return await this.remove(interaction)
    }

    list = async (interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply({ephemeral: true})

        try {
            const guildId = interaction.guildId
            if (!guildId) throw new GuildNotFoundError()

            const guildCachedResult = await this.guildService.get(guildId)
            if (!guildCachedResult.isSuccess()) throw guildCachedResult.error

            const roleProductsResult = await this.service.getAll(guildId)
            if (!roleProductsResult.isSuccess()) throw roleProductsResult.error

            const roleProducts = roleProductsResult.value

            const title = "Product list"
            const thumbnail = "cart"

            const description = roleProducts.length === 0 
            ? InlineBlockText("There are no products") 
            : roleProducts.map(roleProduct => 
                InlineBlockText(`Product Name: ${roleProduct.role.name}\nProduct ID: ${roleProduct.role.id}\nProduct Price: ${roleProduct.price} USD`)).join('\n')
            
            return await EmbedResult.info({interaction, title, thumbnail, description})
        }
        catch(e) {
            return await EmbedResult.fail({interaction, description: String(e)})
        }
    }

    add = async (interaction: ChatInputCommandInteraction) => {
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

            const guildCachedResult = await this.guildService.get(guildId)
            if (!guildCachedResult.isSuccess()) throw guildCachedResult.error

            const guildCached = guildCachedResult.value

            if (price <= 0) throw new RoleProductInvalidPriceError()

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
                role: roleCached, 
                price: price, 
                media: mediaBuffer,
                mediaFilename: mediaFilename,
                description: description,
                guild: guildCached,
            })

            const roleProductResult = await this.service.create(roleProduct)
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

    remove = async (interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply({ephemeral: true})

        try {
            const role = interaction.options.getRole('role')

            if (!role) throw new RoleProductNotPrividedError()

            const guildId = interaction.guildId
            if (!guildId) throw new GuildNotFoundError()

            const guildCachedResult = await this.guildService.get(guildId)
            if (!guildCachedResult.isSuccess()) throw guildCachedResult.error
            
            const result = await this.service.delete(role.id)
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