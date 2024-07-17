import {Guild as discordGuild} from "discord.js";
import { Guild } from "../domain/Guild.js";

export class GuildTransformer {
    static parse = (guild: discordGuild): Guild => {
        const { id, name, icon, createdAt } = guild;

        return new Guild(id, name, icon, createdAt);
    }
}