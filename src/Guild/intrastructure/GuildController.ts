import { GuildService } from "../application/GuildService.js";
import { Guild as discordGuild } from "discord.js";
import { Guild } from "../domain/Guild.js";

class GuildController {
    constructor (private service: GuildService) {}

    async createRecord (guild: discordGuild): Promise<Guild> {
        return await this.service.create(guild)
    }
    async updateRecord(){}
    async deleteRecord(){}
}