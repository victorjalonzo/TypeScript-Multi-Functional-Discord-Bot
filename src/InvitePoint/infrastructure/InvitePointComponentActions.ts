import { ButtonInteraction, User } from "discord.js";
import { IComponentAction } from "../../shared/domain/IComponentAction.js";
import { CustomComponentID } from "../../shared/domain/CustomComponentID.js";
import { IGuildInput } from "../../Guild/domain/IGuildInput.js";
import { IInviteCodeInput } from "../../InviteCode/domain/IInviteCodeInput.js";
import { EmbedResult } from "../../shared/intraestructure/EmbedResult.js";
import { logger } from "../../shared/utils/logger.js";
import { GuildNotFoundError } from "../../shared/domain/Exceptions.js";
import { InviteCode } from "../../InviteCode/domain/InviteCode.js";
import { IMemberInput } from "../../Member/domain/IMemberInput.js";
import { InviteCodeNotFoundError } from "../../InviteCode/domain/InviteCodeExceptions.js";
import { BoldText, InlineBlockText } from "../../shared/utils/textFormating.js";
import { Config } from "../../shared/config/config.js";

export class InvitePointComponentsActions implements IComponentAction{
    id: string

    constructor (
        private guildService: IGuildInput,
        private memberService: IMemberInput,
        private inviteCodeService: IInviteCodeInput
    ) {
        this.id = CustomComponentID.INVITE_POINT
    }

    async execute (interaction: ButtonInteraction) {
        try {
            await interaction.deferReply({ephemeral: true})

            const guildId = interaction.guildId
            if (!guildId) throw new GuildNotFoundError()

            const guildCachedResult = await this.guildService.get(guildId)
            if (!guildCachedResult.isSuccess()) throw guildCachedResult.error

            const guildCached = guildCachedResult.value

            const user: User = interaction.user

            const memberCachedResult = await this.memberService.get(user.id, guildId)
            if (!memberCachedResult.isSuccess()) throw memberCachedResult.error

            const memberCached = memberCachedResult.value

            let inviteCode: InviteCode
            
            const result = await this.inviteCodeService.getByMember(user.id, guildId)

            if (result.isSuccess()) {
                inviteCode = result.value
            }
            else {
                if (result.error instanceof InviteCodeNotFoundError) {
                    const newInviteCode = new InviteCode({
                        member:memberCached,
                        guild:guildCached
                    })
                    const result = await this.inviteCodeService.create(newInviteCode)
                    if (!result.isSuccess()) throw result.error

                    inviteCode = result.value
                }
                else throw result.error
            }

            const link = `${Config.domain}/invite/${inviteCode.code}`

            const title = "THIS IS YOUR INVITE LINK"
            const description = `${BoldText(title)}${InlineBlockText(link)}`

            await EmbedResult.custom({
                description, 
                interaction,
                color: 0x11abe0,
                thumbnail: 'invite'
            })

            logger.info(`Invite link generated for member ${user.username} (${user.id}) in guild ${guildId}`)
        }
        catch (e) {
            await EmbedResult.fail({description: String(e), interaction})
            logger.warn(String(e))
        }
    }
}