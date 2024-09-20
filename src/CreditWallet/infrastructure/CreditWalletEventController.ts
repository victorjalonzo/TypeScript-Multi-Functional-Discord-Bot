import { ICreditWalletInput } from "../domain/ICreditWalletInput.js";
import { logger } from "../../shared/utils/logger.js";
import { GuildNotFoundError } from "../../shared/domain/Exceptions.js";
import { GuildMember as DiscordMember } from "discord.js";
import { CreditWallet } from "../domain/CreditWallet.js";
import { IGuildInput } from "../../Guild/domain/IGuildInput.js";
import { IMemberInput } from "../../Member/domain/IMemberInput.js";

export class CreditWalletEventController {
    constructor (
        private service: ICreditWalletInput,
        private guildService: IGuildInput,
        private memberService: IMemberInput
    ) {}

    create = async (member: DiscordMember): Promise<void> => {
        try {
            const guild = member.guild
            if (!guild) throw new GuildNotFoundError()

            const user = member.user

            const guildCachedResult = await this.guildService.get(guild.id)
            if (!guildCachedResult.isSuccess()) throw guildCachedResult.error

            const cachedGuild = guildCachedResult.value

            const memberCachedResult = await this.memberService.get(user.id, guild.id)
            if (!memberCachedResult.isSuccess()) throw memberCachedResult.error

            const result = await this.service.get(user.id, guild.id)
            
            if (result.isSuccess()) {
                logger.info(`Credit Wallet already exists for ${user.username} (${user.id})`)
                return 
            }

            const memberCached = memberCachedResult.value

            const creditWallet = new CreditWallet({
                memberId: user.id,
                member: memberCached,
                guildId: guild.id,
                guild: cachedGuild,
                credits: cachedGuild.defaultCredits
            })

            const creditWalletCreateResult = await this.service.create(creditWallet)
            if (!creditWalletCreateResult.isSuccess()) throw result.error

            const creditWalletCreated = creditWalletCreateResult.value

            logger.info(`Credit Wallet created for ${user.username} (${user.id}) with ${creditWalletCreated.credits} credits`)
        }
        catch(e) {
            logger.warn(String(e))
        }
    }
}