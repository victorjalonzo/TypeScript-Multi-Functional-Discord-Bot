import { ICreditProductInput } from "../domain/ICreditProductInput.js";
import { ChatInputCommandInteraction } from "discord.js";
import { EmbedResult } from "../../shared/intraestructure/EmbedResult.js";
import { cache }  from "../../shared/intraestructure/Cache.js";
import { CreditProduct } from "../domain/CreditProduct.js";
import { InlineBlockText } from "../../shared/utils/textFormating.js";
import { logger } from "../../shared/utils/logger.js";
import { CreditProductAmountNotProvidedError, CreditProductPriceNotProvidedError } from "../domain/CreditProductExceptions.js";
import { GuildNotFoundError } from "../../shared/domain/Exceptions.js";
import { getBufferFromAttachment } from "../../shared/utils/AttachmentBuffer.js";
import { IGuildInput } from "../../Guild/domain/IGuildInput.js";

export class CreditProductsCommandActions {
    constructor (
        private service: ICreditProductInput, 
        private guildService: IGuildInput,
        private thumbnail:string="credit"
    ) {}

    execute = async (interaction: ChatInputCommandInteraction): Promise<unknown> => {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'list') return await this.list(interaction)
        if (subcommand === 'add') return await this.add(interaction)
        if (subcommand === 'remove') return await this.remove(interaction)
    }

    list = async (interaction: ChatInputCommandInteraction) => {
        try {
            const guildId = interaction.guildId
            if (!guildId) throw GuildNotFoundError 

            const guildCachedResult = await this.guildService.get(guildId)
            if (!guildCachedResult.isSuccess()) throw guildCachedResult.error

            const result = await this.service.getAll(guildId)
            if (!result.isSuccess()) throw result.error

            const creditProducts = result.value

            const title = "Products list"

            const description = creditProducts.length === 0 
            ? InlineBlockText("There are no products") 
            : creditProducts.map(creditProducts => 
                InlineBlockText(`Product Name: ${creditProducts.name}\nProduct ID: ${creditProducts.id}\nProduct Price: ${creditProducts.price} USD`)).join('\n')

            return await EmbedResult.info({title, description, interaction, thumbnail: this.thumbnail})

        }catch(e){
            logger.warn(String(e))
            return await EmbedResult.fail({description: InlineBlockText(String(e)), interaction})
        }
    }

    add = async (interaction: ChatInputCommandInteraction) => {
        try {
            const price = interaction.options.getInteger('price')
            const credits = interaction.options.getInteger('credits')
            const guildId = interaction.guildId
            const productMedia = interaction.options.getAttachment('media')
            const productDescription = interaction.options.getString('description')

            if (!price) throw new CreditProductPriceNotProvidedError()
            if (!credits) throw new CreditProductAmountNotProvidedError()
            if (!guildId) throw new GuildNotFoundError()
    
            const guildCachedResult = await this.guildService.get(guildId)
            if (!guildCachedResult.isSuccess()) throw guildCachedResult.error

            const guildCached = guildCachedResult.value

            const media = productMedia ? await getBufferFromAttachment(productMedia) : null
            const mediaFilename = productMedia ? productMedia.name : null
    
            const creditProduct = new CreditProduct({
                price:price, 
                credits:credits,
                media:media,
                mediaFilename:mediaFilename,
                description:productDescription,
                guild:guildCached,
                guildId:guildId,
            })
    
            const result = await this.service.create(creditProduct)
            if (!result.isSuccess()) throw result.error
            
            const title = "Product added"
            const description = InlineBlockText(`Product Name: ${creditProduct.name}\nProduct ID: ${creditProduct.id}\nProduct Price: ${creditProduct.price} USD`)

            return await EmbedResult.success({title, description, interaction, thumbnail: this.thumbnail})
        }
        catch (e) {
            logger.warn(String(e))
            return await EmbedResult.fail({description: String(e), interaction: interaction})
        }
    }

    remove = async (interaction: ChatInputCommandInteraction) => {
        try {
            const creditId = interaction.options.getString('id')
            const guildId = interaction.guildId

            if (!creditId) throw new CreditProductPriceNotProvidedError()
            if (!guildId) throw new GuildNotFoundError()
    
            const result = await this.service.delete(creditId)
            if (!result.isSuccess()) throw result.error
            
            const credit = result.value

            const title = "Product removed"
            const description = InlineBlockText(`$${credit.price} for ${credit.credits} credits`)
    
            return await EmbedResult.success({title, description, interaction, thumbnail: this.thumbnail})

        } catch(e) {
            logger.warn(String(e))
            return await EmbedResult.fail({description: InlineBlockText(String(e)), interaction: interaction})
        }
    }
}