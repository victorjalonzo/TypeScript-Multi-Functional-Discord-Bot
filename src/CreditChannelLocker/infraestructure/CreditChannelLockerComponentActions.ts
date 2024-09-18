import { ButtonInteraction, GuildMember, InteractionResponse, Message, TextChannel } from "discord.js";
import { ICreditChannelLockerInput } from "../domain/ICreditChannelLockerInput.js";
import { IComponentAction } from "../../shared/domain/IComponentAction.js";
import { CustomComponentID } from "../../shared/domain/CustomComponentID.js";
import { EmbedResult } from "../../shared/intraestructure/EmbedResult.js";
import { BoldText, InlineBlockText } from "../../shared/utils/textFormating.js";
import { IComponentActionData } from "../../shared/domain/IComponentActionData.js";
import { CreditChannelLockerComponentActionsEnums as Actions } from "../domain/CreditChannelLockerActionsEnums.js";
import { GuildNotFoundError, UnknownInteractionError } from "../../shared/domain/Exceptions.js";
import { MemberNotFoundError } from "../../Member/domain/MemberExceptions.js";
import { ICreditWallet } from "../../CreditWallet/domain/ICreditWallet.js";
import { ICreditWalletInput } from "../../CreditWallet/domain/ICreditWalletInput.js";
import { IPaypointInput } from "../../Paypoint/domain/IPaypointInput.js";
import { logger } from "../../shared/utils/logger.js";
import { CreditWalletInsufficientCreditsError } from "../../CreditWallet/domain/CreditWalletExceptions.js";
import { LockerChannelNotFoundError, SourceChannelNotFoundError } from "../domain/CreditChannelLockerExceptions.js";

export class CreditChannelLockerComponentActions implements IComponentAction {
    id: string

    constructor (
        private service: ICreditChannelLockerInput,
        private creditWalletService: ICreditWalletInput,
        private paypointService: IPaypointInput
    ) {
        this.id = CustomComponentID.CREDIT_CHANNEL_LOCKER
    }

    execute = async (interaction: ButtonInteraction, data: IComponentActionData) => {
        try {
            if (data.action === Actions.UNLOCK) {
                return await this.unlock(interaction, data)
            }

            throw new UnknownInteractionError()
        }
        catch (e) {
            return EmbedResult.fail({description: InlineBlockText(String(e)), interaction})
        }
    }

    unlock = async (interaction: ButtonInteraction, data: IComponentActionData) => {
        try {
            await interaction.deferReply({ephemeral: true})

            const guild = interaction.guild
            if (!guild) throw new GuildNotFoundError()

            const member = <GuildMember>interaction.member
            if (!member) throw new MemberNotFoundError()

            const lockerChannelId = <string>data.values.lockerChannelId

            const result = await this.service.get(lockerChannelId)
            if (!result.isSuccess()) throw result.error

            const creditChannelLock = result.value
            const sourceChannelId = creditChannelLock.sourceChannelId

            const sourceChannel = <TextChannel>guild.channels.cache.get(sourceChannelId) 
            ?? await guild.channels.fetch(sourceChannelId)

            const lockerChannel = <TextChannel>guild.channels.cache.get(lockerChannelId) 
            ?? await guild.channels.fetch(sourceChannelId)

            if (!sourceChannel) throw new SourceChannelNotFoundError()
            if (!lockerChannel) throw new LockerChannelNotFoundError()

            const creditLeftResult = await this.creditWalletService.decrement(member.id, guild.id, creditChannelLock.price)
            if (!creditLeftResult.isSuccess()) throw creditLeftResult.error

            const creditLeft = creditLeftResult.value

            sourceChannel.permissionOverwrites.edit(member, {
                ViewChannel: true
            })

            lockerChannel.permissionOverwrites.edit(member, {
                ViewChannel: false
            })

            const title = `CHANNEL UNLOCKED`
            const description = `You have unlocked the channel: <#${sourceChannel.id}> successfully.`

            await EmbedResult.success({title, description, interaction})

            logger.info(`Member ${member.user.tag} (${member.id}) spent ${creditChannelLock.price} credits to unlocked the channel ${sourceChannel.name} (${sourceChannel.id}). They now have ${creditLeft} credits left.`)
            
        }
        catch (e) {
            if (e instanceof CreditWalletInsufficientCreditsError) {
                return await this._insufficientCreditsResponse(interaction, e.availableCredits, e.requiredCredits)
            }

            return EmbedResult.fail({description: InlineBlockText(String(e)), interaction})
        }
    }

    _insufficientCreditsResponse = async (interaction: ButtonInteraction, availableCredits: number, creditsRequired: number): Promise<Message<boolean> | InteractionResponse<boolean>> => {
        const title = "Insufficient Credits"

        let description = `It looks like you don’t have enough credits to unlock this channel just yet. Currently, you have ${availableCredits} credits, but this channel requires ${creditsRequired} credits to be unlocked.`

        let paypointChannelId = null
        let invitepointChannelId = null

        const guildId = interaction.guildId
        if (!guildId) throw new GuildNotFoundError()

        const result = await this.paypointService.get(guildId)

        if (result.isSuccess()) {
            const paypoint = result.value
            if (paypoint.messageId && paypoint.channelId) paypointChannelId = paypoint.channelId
        }

        if (paypointChannelId || invitepointChannelId) {
            description += `\n\n${BoldText("What Can I Do?")}`

            if (paypointChannelId) {
                description += `\n\n• You can buy credits directly in <#${paypointChannelId}>.`
            }

            if (invitepointChannelId) {
                description += `\n\n• You can create a link in <#${invitepointChannelId}> and invite your friends to earn free credits.`
            }
        }

        return await EmbedResult.fail({interaction, title, description})
    }
}