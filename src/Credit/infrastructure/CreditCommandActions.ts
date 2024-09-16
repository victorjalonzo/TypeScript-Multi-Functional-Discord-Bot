import { ICreditInput } from "../domain/ICreditInput.js";
import { ChatInputCommandInteraction } from "discord.js";
import { EmbedResult } from "../../shared/intraestructure/EmbedResult.js";
import { cache }  from "../../shared/intraestructure/Cache.js";
import { Credit } from "../domain/Credit.js";
import { InlineBlockText } from "../../shared/utils/textFormating.js";
import { logger } from "../../shared/utils/logger.js";
import { CreditAmountNotProvidedError, PriceNotProvidedError } from "../domain/CreditExceptions.js";
import { GuildNotFoundError } from "../../shared/domain/Exceptions.js";
import { getBufferFromAttachment } from "../../shared/utils/AttachmentBuffer.js";

export class CreditCommandActions {
    constructor (private service: ICreditInput, private thumbnail:string="credit") {}

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

            const cachedGuild = cache.get(guildId)
            if (!cachedGuild) throw GuildNotFoundError 

            const result = await this.service.getAll(guildId)

            if (!result.isSuccess()) return new Error("It was not possible to get the list of credits")

            const title = "Credit products list"
            let description: string = ""

            if (result.value.length === 0) {
                description = InlineBlockText("The list currently is empty.")
            }
            else {
                description = "" + result.value
                .map(credit => InlineBlockText(`$${credit.price} per ${credit.amount} credits`))
                .join("")
            }

            return await EmbedResult.info({title, description, interaction, thumbnail: this.thumbnail})
            

        }catch(e){
            logger.warn(String(e))
            return await EmbedResult.fail({description: InlineBlockText(String(e)), interaction})
        }
    }

    add = async (interaction: ChatInputCommandInteraction) => {
        try {
            const price = interaction.options.getInteger('price')
            const amount = interaction.options.getInteger('amount')
            const guildId = interaction.guildId
            const productMedia = interaction.options.getAttachment('media')
            const productDescription = interaction.options.getString('description')

            if (!price) throw new PriceNotProvidedError()
            if (!amount) throw new CreditAmountNotProvidedError()
            if (!guildId) throw new GuildNotFoundError()
    
            const cachedGuild = cache.get(guildId)
            if (!cachedGuild) return new GuildNotFoundError()

            const media = productMedia ? await getBufferFromAttachment(productMedia) : null
            const codec = productMedia ? productMedia.name.split('.').pop() : null
    
            const credit = new Credit({
                price:price, 
                amount:amount,
                media:media,
                codec:codec,
                description:productDescription,
                guild:cachedGuild,
                guildId:guildId,
            })
    
            const result = await this.service.create(credit)
            if (!result.isSuccess()) throw result.error
            
            const title = "Credit product added"
            const description = InlineBlockText(`$${price} for ${amount} credits`)

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

            if (!creditId) throw new PriceNotProvidedError()
            if (!guildId) throw new GuildNotFoundError()

            const cachedGuild = cache.get(guildId)
            if (!cachedGuild) return new GuildNotFoundError()
    
            const result = await this.service.delete(creditId)
            if (!result.isSuccess()) throw result.error
            
            const credit = result.value

            const title = "Credit product removed"
            const description = InlineBlockText(`$${credit.price} for ${credit.amount} credits`)
    
            return await EmbedResult.success({title, description, interaction, thumbnail: this.thumbnail})

        } catch(e) {
            logger.warn(String(e))
            return await EmbedResult.fail({description: InlineBlockText(String(e)), interaction: interaction})
        }
    }
}