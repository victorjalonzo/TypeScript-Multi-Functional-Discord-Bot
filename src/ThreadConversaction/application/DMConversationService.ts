import { IRepository } from "../../shared/domain/IRepository.js";
import { IThreadConversation } from "../domain/IThreadConversation.js";
import { Result } from "../../shared/domain/Result.js";

import { 
    ThreadConversationCreationError,
    ThreadConversationNotFoundError,
    ThreadConversationDeletionError,
    ThreadConversationUpdateError
} from "../domain/ThreadConversationExceptions.js";
import { IThreadConversationInput } from "../domain/IThreadConversationInput.js";
import { ThreadConversationState } from "../domain/ThreadConversationStateEnums.js";

export class ThreadConversationService implements IThreadConversationInput {
    constructor(private repository: IRepository<IThreadConversation>) {}

    async create(DMConversaction: IThreadConversation): Promise<Result<IThreadConversation>> {
        try {
            const DMConversactionCreated = await this.repository.create(DMConversaction);
            if (!DMConversactionCreated) throw new ThreadConversationCreationError();
            return Result.success(DMConversactionCreated);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async get(id: string): Promise<Result<IThreadConversation>> {
        try {
            const ThreadConversation = await this.repository.get({id});
            if (!ThreadConversation) throw new ThreadConversationNotFoundError();
            return Result.success(ThreadConversation);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async getActiveOneByMember (memberId: string): Promise<Result<IThreadConversation>> {
        try {
            const ThreadConversation = await this.repository.get({
                memberId, 
                state: {$ne: ThreadConversationState.CLOSED},
            });
            
            if (!ThreadConversation) throw new ThreadConversationNotFoundError();
            return Result.success(ThreadConversation);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async getByMember(memberId: string): Promise<Result<IThreadConversation>> {
        try {
            const ThreadConversation = await this.repository.get({memberId});
            if (!ThreadConversation) throw new ThreadConversationNotFoundError();
            return Result.success(ThreadConversation);
        }
        catch (e) {
            return Result.failure(e);
        }
        
    }

    async update (DMConversaction: IThreadConversation): Promise<Result<IThreadConversation>> {
        try {
            const ThreadConversationUpdated = await this.repository.update({id: DMConversaction.id}, DMConversaction);
            if (!ThreadConversationUpdated) throw new ThreadConversationUpdateError();
            return Result.success(ThreadConversationUpdated);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async delete (memberId: string): Promise<Result<IThreadConversation>> {
        try {
            const ThreadConversationDeleted = await this.repository.delete({memberId});
            if (!ThreadConversationDeleted) throw new ThreadConversationDeletionError();
            return Result.success(ThreadConversationDeleted);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async isAwaitingMemberApproval(memberId: string): Promise<Result<boolean>> {
        try {
            const ThreadConversation = await this.repository.get({memberId});
            if (!ThreadConversation) return Result.success(false)

            if (ThreadConversation.state != ThreadConversationState.WAITING_USER_TO_CONFIRM_MARKED_PAYMENT) return Result.success(false)

            return Result.success(true)
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async isAwaitingAdminApproval(memberId: string): Promise<Result<boolean>> {
        try {
            const ThreadConversation = await this.repository.get({memberId});
            if (!ThreadConversation) return Result.success(false)

            if (ThreadConversation.state != ThreadConversationState.WAITING_ADMIN_TO_APPROVE_PAYMENT) return Result.success(false)

            return Result.success(true)
        }
        catch (e) {
            return Result.failure(e);
        }
    }
}