import {Guild as discordGuild} from "discord.js";
import { Guild } from "../domain/Guild.js";
import { GuildRecordTransformationError } from "../domain/GuildExceptions.js";

export class GuildTransformer {
    static parse = (guild: discordGuild): Guild => {
        try {
            return new Guild({
                id: guild.id,
                name: guild.name,
                icon: guild.icon,
                defaultCredits: 0,
                defaultRole: null,
                defaultNotificationChannel: null,
                defaultInvoiceChannel: null,
                createdAt: new Date(),
                paypoints: [],
                casualPayments: [],
                credits: [],
            });
        }
        catch (e) {
            throw new GuildRecordTransformationError()
        }
    }
}