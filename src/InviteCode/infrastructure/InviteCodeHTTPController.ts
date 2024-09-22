
import { Request, Response } from 'express';
import { logger } from "../../shared/utils/logger.js";
import { IInviteCodeInput } from "../domain/IInviteCodeInput.js";
import { GuildNotFoundError } from '../../shared/domain/Exceptions.js';
import { ChannelType } from 'discord.js';

export class InviteCodeHTTPController {
    constructor (
        private service: IInviteCodeInput,
    ) {}

    activateCode = async (req: Request, res: Response) => {
        try {
            const code = req.params.code;
            const discordClient = req.discordClient;

            if (!discordClient) throw new Error('Discord client not found');

            const result = await this.service.activate(code);
            if (!result.isSuccess()) throw result.error;

            const inviteCode = result.value;

            logger.info(`The Invite code ${inviteCode.code} below ${inviteCode.member.username} (${inviteCode.member.id}) has been activated`);

            const guild = await discordClient.guilds.fetch(inviteCode.guildId);
            if (!guild) throw new GuildNotFoundError()

            const channel = guild.channels.cache.find(channel => channel.type === ChannelType.GuildText) ?? 
            (await guild.channels.fetch()).find(channel => channel?.type === ChannelType.GuildText);

            if (!channel) throw new Error('Channel not found')

            const invite = await guild.invites.create(channel.id);

            return res.redirect(invite.url);
        }
        catch (e) {
            logger.warn(e);
            return res.status(500).send(String(e));
        }
    }
}