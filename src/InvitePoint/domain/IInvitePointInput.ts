import { Result } from "../../shared/domain/Result.js"
import { IInvitePoint } from "./IInvitePoint.js"

export interface IInvitePointInput {
    get (guildId: string): Promise<Result<IInvitePoint>>
    create (invitePoint: IInvitePoint): Promise<Result<IInvitePoint>>
    update (invitePoint: IInvitePoint): Promise<Result<IInvitePoint>>
    delete (guildId: string): Promise<Result<IInvitePoint>>
}