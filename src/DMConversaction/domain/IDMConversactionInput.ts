import { Result } from "../../shared/domain/Result.js";
import { IDMConversaction } from "./IDMConversaction.js";

export interface IDMConversactionInput {
    create (DMConversaction: IDMConversaction): Promise<Result<IDMConversaction>>
    get(id: string): Promise<Result<IDMConversaction>>
    getByMember(memberId: string): Promise<Result<IDMConversaction>>
    update(DMConversaction: IDMConversaction): Promise<Result<IDMConversaction>>
    delete(memberId: string): Promise<Result<IDMConversaction>>
    isAwaitingAdminApproval(memberId: string): Promise<Result<boolean>>
    isAwaitingMemberApproval(memberId: string): Promise<Result<boolean>>
}