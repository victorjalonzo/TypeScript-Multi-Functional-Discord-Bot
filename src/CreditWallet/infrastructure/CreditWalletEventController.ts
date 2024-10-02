import { ICreditWalletInput } from "../domain/ICreditWalletInput.js";
import { logger } from "../../shared/utils/logger.js";
import { GuildNotFoundError } from "../../shared/domain/Exceptions.js";
import { GuildMember as DiscordMember, Guild as DiscordGuild } from "discord.js";
import { CreditWallet } from "../domain/CreditWallet.js";
import { IGuildInput } from "../../Guild/domain/IGuildInput.js";
import { IMemberInput } from "../../Member/domain/IMemberInput.js";
import { refreshLog } from "../../shared/utils/RefreshLog.js";
import { GuildHasNoMembers } from "../../Guild/domain/GuildExceptions.js";
import { MemberNotFoundError } from "../../Member/domain/MemberExceptions.js";

export class CreditWalletEventController {
    constructor (
        private service: ICreditWalletInput,
        private guildService: IGuildInput,
        private memberService: IMemberInput
    ) {}

    refresh = async (guildMembers: DiscordMember[], guild: DiscordGuild): Promise<void> => {
        const walletsCreated: CreditWallet[] = [];

        try {
            const guildRecord = await this.guildService.get(guild.id)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

            if (guildMembers.length === 0) throw new GuildHasNoMembers();

            const creditWallets = await this.service.getAll(guild.id)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

            for (const guildMember of guildMembers) {
                const existingWallet = creditWallets.find(wallet => wallet.member.id === guildMember.id && wallet.guildId === guild.id);
                if (existingWallet) continue 

                const memberRecord = await this.memberService.get(guildMember.id, guild.id)
                .then(r => r.isSuccess() ? r.value : r.error instanceof MemberNotFoundError ? null : Promise.reject(r.error))

                if (!memberRecord) continue

                const creditWallet = new CreditWallet({
                    member: memberRecord,
                    guild: guildRecord,
                    credits: guildRecord.defaultCredits
                });

                const creditWalletCreated = await this.service.create(creditWallet)
                .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

                walletsCreated.push(creditWalletCreated);
            }

        } 
        catch (e) {
            if (!(e instanceof GuildHasNoMembers)) {
                logger.warn(String(e));
            }
        }

        refreshLog({
            itemsAdded: walletsCreated.length,
            itemsUpdated: 0,
            itemsRemoved: 0, // No se eliminan wallets en este proceso
            singular: 'credit wallet',
            plural: 'credit wallets'
        });
    };

    create = async (member: DiscordMember): Promise<void> => {
        try {
            const guild = member.guild
            if (!guild) throw new GuildNotFoundError()

            const user = member.user
            
            await this.service.get(user.id, guild.id)
            .then(r => r.isSuccess() ? Promise.reject(r.error) : null)

            const guildRecord = await this.guildService.get(guild.id)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

            const memberRecord = await this.memberService.get(user.id, guild.id)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

            const creditWallet = new CreditWallet({
                member: memberRecord,
                guild: guildRecord,
                credits: guildRecord.defaultCredits
            })

            const creditWalletCreated= await this.service.create(creditWallet)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

            logger.info(`Credit Wallet created for ${user.username} (${user.id}) with ${creditWalletCreated.credits} credits`)
        }
        catch(e) {
            logger.warn(String(e))
        }
    }
}