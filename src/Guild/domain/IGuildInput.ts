import { IGuild } from "./IGuild.js"
import { Result } from "../../shared/domain/Result.js"

export interface IGuildInput {
    get (filters: Record<string, any>): Promise<Result<IGuild>>
    create (guild: IGuild): Promise<Result<IGuild>>
    update (oldGuild: IGuild, newGuild: IGuild): Promise<Result<IGuild>>
    delete (guild: IGuild): Promise<Result<Record<string, any>>>
}