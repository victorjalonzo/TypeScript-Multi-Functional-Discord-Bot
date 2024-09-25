import { ICasualTransactionInput } from "../../CasualTransaction/domain/ICasualTransactionInput.js";
import { AttachmentBuilder, ButtonInteraction, DMChannel, Message, range, TextChannel, User } from "discord.js";
import { IPaypointInput } from "../../Paypoint/domain/IPaypointInput.js";
import { IRoleProductInput } from "../../RoleProduct/domain/IRoleProductInput.js";
import { GuildNotFoundError } from "../../shared/domain/Exceptions.js";
import { IRoleRewardInput } from "../../RoleReward/domain/IRoleRewardInput.js";
import { createGuildAsistentPrompt } from "./prompts/GuildAsistentPrompt.js";
import { AI } from "./AI.js";
import { logger } from "../../shared/utils/logger.js";
import { IDMConversactionInput } from "../../DMConversaction/domain/IDMConversactionInput.js";
import { getBufferFromAttachment } from "../../shared/utils/AttachmentBuffer.js";
import { nextState, switchTurn } from "../../DMConversaction/domain/DMConversaction.js";
import { createIdentifierCashAppPrompt } from "./prompts/IdentifierCashAppPrompt.js";
import { createUserVerificationQuestionEmbed } from "./embeds/UserVerificationQuestionEmbed.js";
import { createUserPaymentUnderReviewEmbed } from "./embeds/UserPaymentUnderReviewEmbed.js";
import { CasualTransaction } from "../../CasualTransaction/domain/CasualTransaction.js";
import { IMemberInput } from "../../Member/domain/IMemberInput.js";
import { createAdminIncomingPaymentEmbed } from "./embeds/AdminIncomingPaymentEmbed.js";
import { DMConversactionState } from "../../DMConversaction/domain/DMConversactionStateEnums.js";
import { CasualTransactionState } from "../../CasualTransaction/domain/CasualTransactionStateEnums.js";
import { createIdentifierPaypalPrompt } from "./prompts/IdentifierPaypalPrompt.js";
import { createIdentifierApplePayPrompt } from "./prompts/IdentifierApplePayPrompt.js";
import { createIdentifierGooglePayPrompt } from "./prompts/IdentifierGooglePayPrompt.js";
import { createIdentifierVenmoPrompt } from "./prompts/IdentifierVenmoPrompt.js";
import { createIdentifierBitcoinPrompt } from "./prompts/IdentifierBitcoinPrompt.js";
import { createIdentifierEthereumPrompt } from "./prompts/IdentifierEthereumPrompt.js";
import { createIdentifierZellePrompt } from "./prompts/IdentifierZellePrompt.js";
import { IDMConversaction } from "../../DMConversaction/domain/IDMConversaction.js";
import { sleep } from "../../shared/utils/Sleep.js";
import { executeWithAttemps } from "../../shared/utils/executeWithAttemps.js";
import { ICreditProductInput } from "../../CreditProduct/domain/ICreditProductInput.js";
import { ICreditRewardInput } from "../../CreditReward/domain/ICreditRewardInput.js";

export class AgentEventController {
    constructor (
        private casualTransactionService: ICasualTransactionInput,
        private paypointService: IPaypointInput,
        private creditProductService: ICreditProductInput,
        private creditRewardService: ICreditRewardInput,
        private roleProductService: IRoleProductInput,
        private roleRewardService: IRoleRewardInput,
        private DMConversactionService: IDMConversactionInput,
        private memberService: IMemberInput
    ) {}

    replyTextChannel = async (message: Message) => {
        try {
            const guild = message.guild
            if (!guild) throw new GuildNotFoundError()

            const [
                paypointResult, 
                creditProductResult,
                creditRewardResult,
                roleProductResult, 
                roleRewardResult
            ] = await Promise.all([
                this.paypointService.get(guild.id),
                this.creditProductService.getAll(guild.id),
                this.creditRewardService.getAll(guild.id),
                this.roleProductService.getAll(guild.id),
                this.roleRewardService.getAll(guild.id)
            ])

            if (!paypointResult.isSuccess() || !creditProductResult.isSuccess() || !creditRewardResult.isSuccess() || !roleProductResult.isSuccess() || !roleRewardResult.isSuccess()) {
                throw paypointResult.error || creditProductResult.error || creditRewardResult.error || roleProductResult.error || roleRewardResult.error
            }
    
            const paypoint = paypointResult.value
            const creditProducts = creditProductResult.value
            const creditRewards = creditRewardResult.value
            const roleProducts = roleProductResult.value
            const roleRewards = roleRewardResult.value
    
            const currentMessage = `USER: ${message.content}`

            const generalPromt = createGuildAsistentPrompt({
                paypoint, 
                creditProducts,
                creditRewards,
                roleProducts,
                roleRewards,
                conversaction: [currentMessage],
            })

            const AIMessage = <string>await executeWithAttemps(async () => {
                const response = await AI.createCompletion(generalPromt)
                const data = JSON.parse(response)

                const message: string = data.message
                if (!message) throw new Error("No message found in AI response")

                return message
            }, 3)

            return await message.reply(AIMessage)
    
        }
        catch (e) {
            logger.error(e)
            return await message.reply("Sorry, I can't help you at the moment...")
        }
    }

    replyDM = async (message: Message) => {
        try {
            const user = message.author
    
            const DMConversactionResult = await this.DMConversactionService.getActiveOneByMember(user.id)
            if (!DMConversactionResult.isSuccess()) throw DMConversactionResult.error
    
            const DMConversaction = DMConversactionResult.value
    
            if ( DMConversaction.state == DMConversactionState.WAITING_USER_TO_CONFIRM_MARKED_PAYMENT){
                await this._handleWaitingUserToConfirmMarkedPayment(message)
            }
            if ( DMConversaction.state == DMConversactionState.WAITING_ADMIN_TO_APPROVE_PAYMENT){
                await this._handleWaitingAdminToApprovePayment(message)
            }
            if ( DMConversaction.state == DMConversactionState.WAITING_USER_TO_PROVIDE_ACCOUNT_NAME){
                await this._handleWaitingUserToProvideAccountName(message, DMConversaction)
            }
            if ( DMConversaction.state == DMConversactionState.WAITING_USER_TO_PROVIDE_RECEIPT_IMAGE){
                await this._handleWaitingUserToProvideReceiptImage(message, DMConversaction, user)
            }
    
            return await this.DMConversactionService.update(DMConversaction)
        }
        catch (e) {
            logger.error(e)
        }

    }

    _handleWaitingAdminToApprovePayment = async (message: Message) => {
        return await message.reply("Your payment is still under review, please wait until the admin approves it")
    }

    _handleWaitingUserToConfirmMarkedPayment = async (message: Message) => {
        return await message.reply("Please confirm or deny that you made a payment")
    }

    _handleWaitingUserToProvideAccountName = async (message: Message, DMConversaction: IDMConversaction) => {
        DMConversaction.history.push(`USER: ${message.content}`)

        const identifiers: {[key: string]: Function} = {
            cashapp: createIdentifierCashAppPrompt,
            zelle: createIdentifierZellePrompt,
            paypal: createIdentifierPaypalPrompt,
            applepay: createIdentifierApplePayPrompt,
            googlepay: createIdentifierGooglePayPrompt,
            venmo: createIdentifierVenmoPrompt,
            bitcoin: createIdentifierBitcoinPrompt,
            ethereum: createIdentifierEthereumPrompt
        }

        const rawMethodName = DMConversaction.casualPaymentMethodName.toLowerCase().replace(" ", "")
        const identifierFn = identifiers[rawMethodName]

        if (identifierFn){
            const conversationHistory = DMConversaction.history.join("\n")
            const prompt = identifierFn(conversationHistory)

            const response = await AI.createCompletion(prompt)
            const data = JSON.parse(response)

            if (data.isValid) {
                DMConversaction.paymentFrom = data.identifier
                nextState(DMConversaction)        
            }
            else {
                const AIMessage = await message.channel.send(data.message)
                DMConversaction.history.push(`AI: ${AIMessage}`)
            }
        }
        else {
            DMConversaction.paymentFrom = message.content
            nextState(DMConversaction)
        }
    }

    _handleWaitingUserToProvideReceiptImage = async (message: Message, DMConversaction: IDMConversaction, user: User) => {
        if (!DMConversaction.botTurn) {
            for (const attachment of message.attachments.values()) {
                const buffer = await getBufferFromAttachment(attachment)
                DMConversaction.invoices.push(buffer)
            }

            if (DMConversaction.invoices.length == 0) {
                return await message.reply("Please provide your screenshot receipt to continue")
            }

            const memberResult = await this.memberService.get(user.id, DMConversaction.guildId)
            if (!memberResult.isSuccess()) throw memberResult.error

            const member = memberResult.value

            const casualTransaction = new CasualTransaction({
                member: member,
                memberId: member.id,
                guildId: DMConversaction.guildId,
                state: CasualTransactionState.PENDING,
                paymentMethodId: DMConversaction.casualPaymentMethodId,
                paymentMethodName: DMConversaction.casualPaymentMethodName,
                paymentMethodValue: DMConversaction.casualPaymentMethodValue,
                paymentFrom: <string>DMConversaction.paymentFrom,
                invoices: DMConversaction.invoices,
                productId: DMConversaction.productId,
                productName: DMConversaction.productName,
                productPrice: DMConversaction.productPrice,
                productType: DMConversaction.productType
            })

            const casualTransactionResult = await this.casualTransactionService.create(casualTransaction)
            if (!casualTransactionResult.isSuccess()) throw casualTransactionResult.error

            const casualTransactionCreated = casualTransactionResult.value

            const guild = user.client.guilds.cache.get(DMConversaction.guildId)
            if (!guild) throw new GuildNotFoundError()
            
            const owner = await guild.fetchOwner()

            const invoiceImageBuffer = DMConversaction.invoices[0]
            const invoiceImageAttachment = new AttachmentBuilder(invoiceImageBuffer, {name: "invoice.png"})

            const incomingPaymentEmbed = await createAdminIncomingPaymentEmbed({
                methodName: DMConversaction.casualPaymentMethodName,
                methodValue: DMConversaction.casualPaymentMethodValue,
                paymentFrom: <string>DMConversaction.paymentFrom,
                image: invoiceImageAttachment,
                DMConversactionId: DMConversaction.id,
                guildName: guild.name,
                guildId: guild.id,
                memberId: user.id
            })

            await owner.user.send({
                embeds: [incomingPaymentEmbed.embed], 
                files: incomingPaymentEmbed.files,
                components: [<any>incomingPaymentEmbed.buttonRow]
            })

            nextState(DMConversaction)

            const paymentUnderReviewEmbed = await createUserPaymentUnderReviewEmbed()

            const updatableMessage = await message.channel.send({
                embeds: [paymentUnderReviewEmbed.embed], 
                files: paymentUnderReviewEmbed.files
            })

            DMConversaction.updatableMessageId = updatableMessage.id
            DMConversaction.casualTransactionId = casualTransactionCreated.id
        }

        else {
            const title = "SEND A SCREENSHOT OF YOUR PAYMENT RECEIPT"
            const description = "Please send a screenshot of your payment receipt to finish."
            const response = await createUserVerificationQuestionEmbed({title, description, count: "2/2"})

            await message.channel.send({embeds: [response.embed], files: response.files})

            switchTurn(DMConversaction)
        }
    }


    /*
    replyDM = async (message: Message) => {
        try {
            const user = message.author

            const DMConversactionResult = await this.DMConversactionService.getActiveOneByMember(user.id)
            if (!DMConversactionResult.isSuccess()) throw DMConversactionResult.error
    
            const DMConversaction = DMConversactionResult.value
    
            if (DMConversaction.state === DMConversactionState.WAITING_USER_TO_CONFIRM_MARKED_PAYMENT) {
                return await message.reply("Please confirm or deny that you made a payment")
            }
    
            if (DMConversaction.state === DMConversactionState.WAITING_ADMIN_TO_APPROVE_PAYMENT) {
                return await message.reply("Your payment is still under review, please wait until the admin approves it")
            }
    
            if (DMConversaction.state === DMConversactionState.WAITING_USER_TO_PROVIDE_ACCOUNT_NAME) {
                DMConversaction.history.push(`USER: ${message.content}`)

                const identifiers: {[key: string]: Function} = {
                    cashapp: createIdentifierCashAppPrompt,
                    zelle: createIdentifierZellePrompt,
                    paypal: createIdentifierPaypalPrompt,
                    applepay: createIdentifierApplePayPrompt,
                    googlepay: createIdentifierGooglePayPrompt,
                    venmo: createIdentifierVenmoPrompt,
                    bitcoin: createIdentifierBitcoinPrompt,
                    ethereum: createIdentifierEthereumPrompt
                }

                const rawMethodName = DMConversaction.casualPaymentMethodName.toLowerCase().replace(" ", "")
                const identifierFn = identifiers[rawMethodName]

                if (identifierFn){
                    const conversationHistory = DMConversaction.history.join("\n")
                    const prompt = identifierFn(conversationHistory)
    
                    const response = await AI.createCompletion(prompt)
                    const data = JSON.parse(response)
    
                    if (data.isValid) {
                        DMConversaction.paymentFrom = data.identifier
                        nextState(DMConversaction)        
                    }
                    else {
                        const AIMessage = await message.channel.send(data.message)
                        DMConversaction.history.push(`AI: ${AIMessage}`)
                    }
                }
                else {
                    DMConversaction.paymentFrom = message.content
                    nextState(DMConversaction)
                }
            }
    
            if (DMConversaction.state === DMConversactionState.WAITING_USER_TO_PROVIDE_RECEIPT_IMAGE) {
                if (!DMConversaction.botTurn) {
                    for (const attachment of message.attachments.values()) {
                        const buffer = await getBufferFromAttachment(attachment)
                        DMConversaction.invoices.push(buffer)
                    }

                    if (DMConversaction.invoices.length == 0) {
                        return await message.reply("Please provide your screenshot receipt to continue")
                    }

                    const memberResult = await this.memberService.get(user.id, DMConversaction.guildId)
                    if (!memberResult.isSuccess()) throw memberResult.error

                    const member = memberResult.value

                    const casualTransaction = new CasualTransaction({
                        member: member,
                        memberId: member.id,
                        guildId: DMConversaction.guildId,
                        state: CasualTransactionState.PENDING,
                        paymentMethodId: DMConversaction.casualPaymentMethodId,
                        paymentMethodName: DMConversaction.casualPaymentMethodName,
                        paymentMethodValue: DMConversaction.casualPaymentMethodValue,
                        paymentFrom: <string>DMConversaction.paymentFrom,
                        invoices: DMConversaction.invoices,
                        productId: DMConversaction.productId,
                        productName: DMConversaction.productName,
                        productPrice: DMConversaction.productPrice,
                        productType: DMConversaction.productType
                    })

                    const casualTransactionResult = await this.casualTransactionService.create(casualTransaction)
                    if (!casualTransactionResult.isSuccess()) throw casualTransactionResult.error

                    const casualTransactionCreated = casualTransactionResult.value

                    const guild = user.client.guilds.cache.get(DMConversaction.guildId)
                    if (!guild) throw new GuildNotFoundError()
                    
                    const owner = await guild.fetchOwner()

                    const invoiceImageBuffer = DMConversaction.invoices[0]
                    const invoiceImageAttachment = new AttachmentBuilder(invoiceImageBuffer, {name: "invoice.png"})

                    const incomingPaymentEmbed = await createAdminIncomingPaymentEmbed({
                        methodName: DMConversaction.paymentMethodName,
                        methodValue: DMConversaction.paymentMethodValue,
                        paymentFrom: <string>DMConversaction.paymentFrom,
                        image: invoiceImageAttachment,
                        DMConversactionId: DMConversaction.id,
                        guildName: guild.name,
                        guildId: guild.id,
                        memberId: user.id
                    })

                    await owner.user.send({
                        embeds: [incomingPaymentEmbed.embed], 
                        files: incomingPaymentEmbed.files,
                        components: [<any>incomingPaymentEmbed.buttonRow]
                    })

                    nextState(DMConversaction)

                    const paymentUnderReviewEmbed = await createUserPaymentUnderReviewEmbed()

                    const updatableMessage = await message.channel.send({
                        embeds: [paymentUnderReviewEmbed.embed], 
                        files: paymentUnderReviewEmbed.files
                    })

                    DMConversaction.updatableMessageId = updatableMessage.id
                    DMConversaction.casualTransactionId = casualTransactionCreated.id
                }

                else {
                    const title = "SEND A SCREENSHOT OF YOUR PAYMENT RECEIPT"
                    const description = "Please send a screenshot of your payment receipt to finish."
                    const response = await createUserVerificationQuestionEmbed({title, description, count: "2/2"})

                    await message.channel.send({embeds: [response.embed], files: response.files})

                    switchTurn(DMConversaction)
                }
            }
    
            return await this.DMConversactionService.update(DMConversaction)
        }
        catch (e) {
            logger.warn(e)
        }
    }
    */

    replyMarkedCasualPaymentConfirmation = async (user: User, DMConversactionId: string) => {
        try {
            const DMConversactionResult = await this.DMConversactionService.get(DMConversactionId)
            if (!DMConversactionResult.isSuccess()) throw DMConversactionResult.error

            const DMConversaction = DMConversactionResult.value

            if (DMConversaction.state != DMConversactionState.WAITING_USER_TO_CONFIRM_MARKED_PAYMENT) throw new Error("It's expired already")

            const identifierQuestions: Record<string, any>= {
                cashapp: {
                    title: "What is your Cash App $tagname?",
                    description: "Please type the $tagname associated with your Cash App account from where you sent the payment."
                },
                applepay: {
                    title: "What is your Apple Pay email address or phone number?",
                    description: "Please type the email address or phone number associated with your Apple Pay account from where you sent the payment."
                },
                paypal: {
                    title: "What is your PayPal email address?",
                    description: "Please type the email address associated with your PayPal account from where you sent the payment."
                },
                zelle: {
                    title: "What is your Zelle email address or phone number?",
                    description: "Please type the email address or phone number associated with your Zelle account from where you sent the payment."
                },
                venmo: {
                    title: "What is your Venmo username?",
                    description: "Please type your Venmo username (e.g., @username) from where you sent the payment."
                },
                googlepay: {
                    title: "What is your Google Pay email address or phone number?",
                    description: "Please type the email address or phone number associated with your Google Pay account from where you sent the payment."
                },
                bitcoin: {
                    title: "What is your Bitcoin address?",
                    description: "Please type the Bitcoin address (a long string of characters) from where you sent the payment."
                },
                ethereum: {
                    title: "What is your Ethereum address?",
                    description: "Please type the Ethereum address (e.g., starting with 0x) from where you sent the payment."
                }
            };
            
            const rawMethodName = DMConversaction.casualPaymentMethodName.toLowerCase().replace(" ", "")
            const identifierQuestion = identifierQuestions[rawMethodName]

            if (!identifierQuestion) throw new Error(`It was not possible to find a identifier question for the payment method ${DMConversaction.casualPaymentMethodName}`)

            const { title, description } = identifierQuestion
            const count = "1/2"

            const response = await createUserVerificationQuestionEmbed({title, description, count})

            await user.send({embeds: [response.embed], files: response.files})
            DMConversaction.history.push(`AI: ${title}. ${description}`)

            nextState(DMConversaction, false)

            const DMConversactionUpdated = await this.DMConversactionService.update(DMConversaction)
            if (!DMConversactionUpdated.isSuccess()) throw DMConversactionUpdated.error
        
        } catch(e) {
            logger.warn(e)
        }
    }
}