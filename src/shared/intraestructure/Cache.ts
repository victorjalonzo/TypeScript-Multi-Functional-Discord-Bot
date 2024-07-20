import { IGuild } from "../../Guild/domain/IGuild.js";

class Cache {
    private cache: Record<string, any>;

    constructor() {
      this.cache = {};
    }

    create = (guild: IGuild): void => {
      this.cache[guild.id] = guild;
    }

    getAll = (): Record<string, any> => {
        return this.cache;
    }

    get = (guildId: string): IGuild => {
        return this.cache[guildId];
    }

    delete = (guildId: string): void => {
        delete this.cache[guildId];
    }
}

export const cache = new Cache();