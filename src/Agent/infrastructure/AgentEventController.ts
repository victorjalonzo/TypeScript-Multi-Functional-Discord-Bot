import { ICasualTransactionInput } from "../../CasualTransaction/domain/ICasualTransactionInput.js";
import { Message} from "discord.js";
import { IPaypointInput } from "../../Paypoint/domain/IPaypointInput.js";
import { IRoleProductInput } from "../../RoleProduct/domain/IRoleProductInput.js";
import { GuildNotFoundError } from "../../shared/domain/Exceptions.js";
import { IRoleRewardInput } from "../../RoleReward/domain/IRoleRewardInput.js";
import { createGuildAsistentPrompt } from "./prompts/GuildAsistentPrompt.js";
import { AI } from "./AI.js";
import { logger } from "../../shared/utils/logger.js";
import { IThreadConversationInput } from "../../ThreadConversaction/domain/IThreadConversationInput.js";
import { IMemberInput } from "../../Member/domain/IMemberInput.js";
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
        private DMConversactionService: IThreadConversationInput,
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
}