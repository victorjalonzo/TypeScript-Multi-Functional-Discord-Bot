import { Result } from "../../shared/domain/Result.js";
import { IMember } from "./IMember.js";

export interface IMemberInput {
    create(member: IMember): Promise<Result<IMember>>
    update(data: IMember): Promise<Result<IMember>>
    getAll(guildId: string): Promise<Result<IMember[]>>
    getInviteMembersCount(inviterId: string, guildId: string): Promise<Result<number>>
    get(id: string, guildId: string): Promise<Result<IMember>>
    delete(filters: Record<string, any>): Promise<Result<IMember>>
    deleteAll(guildId: string): Promise<Result<IMember[]>>
}