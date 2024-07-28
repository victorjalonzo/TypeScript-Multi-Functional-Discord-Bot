import { ICachedGuild } from "../../shared/intraestructure/ICachedGuild.js";
import { IGuild } from "../../Guild/domain/IGuild.js";

class Cache {
    private cache: ICachedGuild[];

    constructor() {
      this.cache = [];
    }

    create = (guild: IGuild): void => {
      const index = this.cache.findIndex(g => g.id === guild.id);
      if (index !== -1) return

      this.cache.push(<ICachedGuild>guild);
    }

    update = (guild: ICachedGuild): void => {
      const index = this.cache.findIndex(g => g.id === guild.id);
      if (index !== -1) this.create(guild);
      this.cache[index] = guild;
    }

    getAll = (): ICachedGuild[] => {
        return this.cache;
    }

    get = (guildId: string): ICachedGuild | undefined => {
      return this.cache.find(guild => guild.id === guildId);
    }

    delete = (guildId: string): ICachedGuild | undefined => {
        const index = this.cache.findIndex(guild => guild.id === guildId);
        if (index !== -1) return this.cache.splice(index, 1)[0];
    }
}

export const cache = new Cache();