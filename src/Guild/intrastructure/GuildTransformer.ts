import {Guild as discordGuild} from "discord.js";
import { Guild } from "../domain/Guild.js";
import { GuildTransformationError } from "../domain/GuildExceptions.js";

export class GuildTransformer {
    static parse = (guild: discordGuild): Guild => {
        try {
            const { id, name, icon, createdAt } = guild;
            return new Guild(id, name, icon, createdAt);
        }
        catch (e) {
            throw new GuildTransformationError(guild, String(e))
        }
    }
}