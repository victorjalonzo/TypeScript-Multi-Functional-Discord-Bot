import { Guild } from "./Guild.js"

export interface IGuildInput {
    getAll: () => Promise<Guild[]>
    get: (id: string) => Promise<Guild | null>
    create: (guild: Guild) => Promise<Guild>
    update: (guild: Guild) => Promise<Guild>
    delete: (id: string) => Promise<Guild>
}