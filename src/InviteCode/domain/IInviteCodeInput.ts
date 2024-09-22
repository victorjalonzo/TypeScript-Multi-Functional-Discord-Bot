import { Result } from "../../shared/domain/Result.js"
import { IInviteCode } from "./IInviteCode.js"

export interface IInviteCodeInput {
    create(invideCode: IInviteCode): Promise<Result<IInviteCode>>
    getActiveOne(guildId: string): Promise<Result<IInviteCode>>
    activate(code: string): Promise<Result<IInviteCode>>
    deactivate(code: string): Promise<Result<IInviteCode>>
    getByMember(memberId: string, guildId: string): Promise<Result<IInviteCode>>
    getAll(guildId: string): Promise<Result<IInviteCode[]>>
    deleteByMember(memberId: string, guildId: string): Promise<Result<IInviteCode>>
    deleteAll(guild: string): Promise<Result<IInviteCode[]>>
}