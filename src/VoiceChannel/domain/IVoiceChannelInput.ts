import { IVoiceChannel } from "./IVoiceChannel.js";
import { Result } from "../../shared/domain/Result.js";

export interface IVoiceChannelInput {
    create (voiceChannel: IVoiceChannel): Promise<Result<IVoiceChannel>>
    get (id: string, guildId: string): Promise<Result<IVoiceChannel>>
    getAll (guildId: string): Promise<Result<IVoiceChannel[]>>
    update (voiceChannel: IVoiceChannel): Promise<Result<IVoiceChannel>>
    delete (id: string, guildId: string): Promise<Result<Record<string, any>>>
}