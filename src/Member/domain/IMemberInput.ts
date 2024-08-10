import { Result } from "../../shared/domain/Result.js";
import { IMember } from "./IMember.js";

export interface IMemberInput {
    create(member: IMember): Promise<Result<IMember>>
    update(filters: Record<string, any>, data: IMember): Promise<Result<IMember>>
    getInviteMembersCount(inviterId: string, guildId: string): Promise<Result<number>>
    get(filters: Record<string, any>): Promise<Result<IMember>>
    delete(filters: Record<string, any>): Promise<Result<IMember>>
}