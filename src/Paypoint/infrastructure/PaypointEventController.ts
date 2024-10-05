import {Message, PartialMessage, ChannelType, User, Guild, Attachment, AttachmentBuilder} from "discord.js"
import { IPaypointInput } from "../domain/IPaypointInput.js"
import { GuildNotFoundError } from "../../shared/domain/Exceptions.js"
import { logger } from "../../shared/utils/logger.js"
import { IThreadConversation } from "../../ThreadConversaction/domain/IThreadConversation.js"
import { IThreadConversationInput } from "../../ThreadConversaction/domain/IThreadConversationInput.js"
import { ThreadConversationState } from "../../ThreadConversaction/domain/ThreadConversationStateEnums.js"
import { getBufferFromAttachment } from "../../shared/utils/AttachmentBuffer.js"
import { IMemberInput } from "../../Member/domain/IMemberInput.js"
import { CasualTransaction } from "../../CasualTransaction/domain/CasualTransaction.js"
import { ProductType } from "../../shared/domain/ProductTypeEnums.js"
import { ICreditProductInput } from "../../CreditProduct/domain/ICreditProductInput.js"
import { IRoleProductInput } from "../../RoleProduct/domain/IRoleProductInput.js"
import { ICasualPaymentInput } from "../../CasualPayment/domain/ICasualPaymentInput.js"
import { ICasualTransactionInput } from "../../CasualTransaction/domain/ICasualTransactionInput.js"
import { createUserPaymentUnderReviewEmbed } from "./Embeds/UserPaymentUnderReviewEmbed.js"
import { createAdminIncomingPaymentEmbed } from "./Embeds/AdminIncomingPaymentEmbed.js"
import { PaypointNotFoundError } from "../domain/PaypointExceptions.js"

export class PaypointEventController {
    constructor (
        private service: IPaypointInput,
        private threadConversationService: IThreadConversationInput,
        private memberService: IMemberInput,
        private creditProductService: ICreditProductInput,
        private roleProductService: IRoleProductInput,
        private casualPaymentMethodService: ICasualPaymentInput,
        private casualTransactionService: ICasualTransactionInput
    ){}

    replyActiveThreadConversation = async  (message: Message) => {
        try {
            if (message.channel.type !== ChannelType.PrivateThread) return

            const threadChannel = message.channel
            const guild = message.guild
    
            if (!guild) throw new GuildNotFoundError()
    
            const threadConversation = await this.threadConversationService.getActiveOneByThreadChannel(threadChannel.id, guild.id)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))
    
            if (threadConversation.state == ThreadConversationState.WAITING_ADMIN_TO_APPROVE_PAYMENT){
                return await message.reply("Please wait for admin to approve your payment")
            }

            if (threadConversation.state == ThreadConversationState.WAITING_USER_TO_PROVIDE_RECEIPT_IMAGE){
                return await this._handleWaitingUserToProvideReceiptImage(message, guild, threadConversation)
            }
        }
        catch (e) {
            logger.warn(e)
        }
    }

    _handleWaitingUserToProvideReceiptImage = async (
        message: Message, 
        guild: Guild, 
        threadConversation: IThreadConversation
    ) => {
        for (const attachment of message.attachments.values()) {
            const buffer = await getBufferFromAttachment(attachment)
            threadConversation.invoices.push(buffer)
        }
        if (threadConversation.invoices.length == 0) {
            return await message.reply("Please provide your screenshot receipt to continue")
        }
        const memberRecord = await this.memberService.get(message.author.id, guild.id)
        .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

        const casualPaymentMethod = await this.casualPaymentMethodService.get(threadConversation.casualPaymentMethodId, guild.id)
        .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

        const product = threadConversation.productType == ProductType.CREDIT
        ? await this.creditProductService.get(threadConversation.productId).then(r => r.isSuccess() ? r.value : Promise.reject(r.error))
        : await this.roleProductService.get(threadConversation.productId).then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

        const casualTransaction = new CasualTransaction({
            member: memberRecord,
            casualPaymentMethod: casualPaymentMethod,
            product: product,
            guild: threadConversation.guild,
            paymentFrom: <string>threadConversation.paymentFrom,
            invoices: threadConversation.invoices
        })

        const casualTransactionCreated = await this.casualTransactionService.create(casualTransaction)
        .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

        const owner = await guild.fetchOwner()

        const invoiceImageBuffer = threadConversation.invoices[0]
        const invoiceImageAttachment = new AttachmentBuilder(invoiceImageBuffer, {name: "invoice.png"})
        
        const incomingPaymentEmbed = await createAdminIncomingPaymentEmbed({
            methodName: threadConversation.casualPaymentMethodName,
            methodValue: threadConversation.casualPaymentMethodValue,
            paymentFrom: <string>threadConversation.paymentFrom,
            image: invoiceImageAttachment,
            threadConversationId: threadConversation.id,
            guildName: guild.name,
            guildId: guild.id,
            memberId: message.author.id
        })

        await owner.user.send({
            embeds: [incomingPaymentEmbed.embed], 
            files: incomingPaymentEmbed.files,
            components: [<any>incomingPaymentEmbed.buttonRow]
        })

        threadConversation.state = ThreadConversationState.WAITING_ADMIN_TO_APPROVE_PAYMENT

        const paymentUnderReviewEmbed = await createUserPaymentUnderReviewEmbed()

        const updatableMessage = await message.channel.send({
            embeds: [paymentUnderReviewEmbed.embed], 
            files: paymentUnderReviewEmbed.files
        })

        threadConversation.updatableMessageId = updatableMessage.id
        threadConversation.casualTransactionId = casualTransactionCreated.id

        await this.threadConversationService.update(threadConversation)
        .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))
    }

    deleteUpdatableMessageID = async (message: Message | PartialMessage | Record<string, any>) => {
        try {
            const paypoint = await this.service.getByMessageID(message.id)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))
    
            paypoint.channelId = null
            paypoint.messageId = null
    
            const updateResult = await this.service.update(paypoint)
            if (!updateResult.isSuccess()) throw updateResult.error

            logger.info(`The Paypoint was deleted`)
        }
        catch (e) {
            if (e instanceof PaypointNotFoundError) return
            logger.error(e)
        }
    }
}