import { AttachmentBuilder, TextChannel as DiscordTextChannel, Message } from "discord.js";
import { ICasualPaymentInput } from "../../CasualPayment/domain/ICasualPaymentInput.js";
import { ICreditProductInput } from "../../CreditProduct/domain/ICreditProductInput.js";
import { IRoleProductInput } from "../../RoleProduct/domain/IRoleProductInput.js";
import { IPaypointInput } from "../domain/IPaypointInput.js";
import { ProductTypeNotSupported, MissingCasualPaymentMethodsError, PaypointPaymentMethodNotChosenError, PaypointProductTypeNotChosenError } from "../domain/PaypointExceptions.js";
import { CreditProduct } from "../../CreditProduct/domain/CreditProduct.js";
import { RoleProduct } from "../../RoleProduct/domain/RoleProduct.js";
import { ProductType } from "../../shared/domain/ProductTypeEnums.js";
import { CreditProductsNotFoundError } from "../../CreditProduct/domain/CreditProductExceptions.js";
import { RoleProductsNotFound } from "../../RoleProduct/domain/RoleProductExceptions.js";
import { createGuildMenuEmbed } from "./Embeds/GuildMenuEmbed.js";

interface IOptions {
    service: IPaypointInput,
    creditProductService: ICreditProductInput,
    roleProductService: IRoleProductInput,
    casualPaymentMethodService: ICasualPaymentInput,
    channel: DiscordTextChannel,
    guildId: string
}

export class PaypointMessage {
    static create = async (options: IOptions): Promise<Message<boolean>> => {
        const { service, creditProductService, roleProductService, casualPaymentMethodService, channel, guildId } = options
    
        const paypoint = await service.get(guildId)
        .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))
    
        if (!paypoint.paymentMethod) throw new PaypointPaymentMethodNotChosenError()
        if (!paypoint.productType) throw new PaypointProductTypeNotChosenError()
    
        let products: CreditProduct[] | RoleProduct[]
    
        if (paypoint.productType === ProductType.CREDIT) {
            products = await creditProductService.getAll(guildId)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))
            if (products.length === 0) throw new CreditProductsNotFoundError()
        }
        else if (paypoint.productType === ProductType.ROLE) {
            products = await roleProductService.getAll(guildId)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))
            if (products.length === 0) throw new RoleProductsNotFound()
        }
        else throw new ProductTypeNotSupported()
    
        const casualPaymentMethods = await casualPaymentMethodService.getAll(guildId)
        .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))
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
            products: products,
        })
    
        const message = await channel.send({
            embeds: [embed], 
            components: [<any>selectRow], 
            files: files}
        )
    
        paypoint.channelId = message.channelId
        paypoint.messageId = message.id
        
        await service.update(paypoint)
        .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))
    
        return message
    }
}