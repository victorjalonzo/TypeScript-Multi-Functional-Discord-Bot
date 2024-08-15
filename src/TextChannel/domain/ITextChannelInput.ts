import { ITextChannel } from "./ITextChannel.js"
import { Result } from "../../shared/domain/Result.js"

export interface ITextChannelInput {
    create(textChannel: ITextChannel): Promise<Result<ITextChannel>>
    update(textChannel: ITextChannel): Promise<Result<ITextChannel>>
    get(id: string, guildId: string): Promise<Result<ITextChannel>>
    getAll(guildId: string): Promise<Result<ITextChannel[]>>
    delete(id: string, guildId: string): Promise<Result<ITextChannel>>
}