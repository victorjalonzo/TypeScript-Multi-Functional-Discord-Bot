import { ICategoryChannel } from "./ICategoryChannel.js"
import { Result } from "../../shared/domain/Result.js"

export interface ICategoryChannelInput {
    create (categoryChannel: ICategoryChannel): Promise<Result<ICategoryChannel>>
    get(id: string, guildId: string): Promise<Result<ICategoryChannel>>
    getAll(guildId: string): Promise<Result<ICategoryChannel[]>>
    update(categoryChannel: ICategoryChannel): Promise<Result<ICategoryChannel>>
    delete(id: string, guildId: string): Promise<Result<ICategoryChannel>>
}