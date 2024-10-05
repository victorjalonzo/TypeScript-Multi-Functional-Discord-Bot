import { Result } from "../../shared/domain/Result.js";
import { IThreadConversation } from "./IThreadConversation.js";

export interface IThreadConversationInput {
    create (DMConversaction: IThreadConversation): Promise<Result<IThreadConversation>>
    get(id: string): Promise<Result<IThreadConversation>>
    getByMember(memberId: string, guildId: string): Promise<Result<IThreadConversation>>
    getActiveOneByThreadChannel(threadChannelId: string, guildId: string): Promise<Result<IThreadConversation>>
    getActiveOneByMember(memberId: string, guildId: string): Promise<Result<IThreadConversation>>
    getActiveOneByThreadChannel(threadChannelId: string, guildId: string): Promise<Result<IThreadConversation>>
    update(DMConversaction: IThreadConversation): Promise<Result<IThreadConversation>>
    cancel(id: string): Promise<Result<IThreadConversation>>
    close(id: string): Promise<Result<IThreadConversation>>
    delete(id: string): Promise<Result<IThreadConversation>>
    isAwaitingAdminApproval(memberId: string): Promise<Result<boolean>>
}