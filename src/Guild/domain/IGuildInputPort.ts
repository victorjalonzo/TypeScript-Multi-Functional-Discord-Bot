import { IGuild } from "./IGuild.js"

export interface IGuildInput {
    create (guild: IGuild): Promise<Partial<IGuild>>
    update (oldGuild: IGuild, newGuild: IGuild): Promise<Partial<IGuild>>
}