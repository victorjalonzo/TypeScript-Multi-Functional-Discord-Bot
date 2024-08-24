import { IGuild } from "./IGuild.js"
import { Result } from "../../shared/domain/Result.js"

export interface IGuildInput {
    get (id: string): Promise<Result<IGuild>>
    create (guild: IGuild): Promise<Result<IGuild>>
    update (oldGuild: IGuild, newGuild: IGuild): Promise<Result<IGuild>>
    delete (id: string): Promise<Result<Record<string, any>>>
}