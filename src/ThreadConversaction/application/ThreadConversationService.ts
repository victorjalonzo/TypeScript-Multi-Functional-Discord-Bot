import { IRepository } from "../../shared/domain/IRepository.js";
import { IThreadConversation } from "../domain/IThreadConversation.js";
import { Result } from "../../shared/domain/Result.js";

import { 
    ThreadConversationCreationError,
    ThreadConversationNotFoundError,
    ThreadConversationDeletionError,
    ThreadConversationUpdateError,
    ThreadConversationClosedAlreadyError,
    ThreadConversationCancelledAlreadyError,
    ThreadConversationAlreadyWaitingApprovalError
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
            const ThreadConversation = await this.repository.get({id}, 'guild');
            if (!ThreadConversation) throw new ThreadConversationNotFoundError();
            return Result.success(ThreadConversation);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async getActiveOneByThreadChannel (threadChannelId: string, guildId: string): Promise<Result<IThreadConversation>> {
        try {
            const threadConversation = await this.repository.get({
                threadChannelId, 
                guildId,
                state: {$ne: ThreadConversationState.CLOSED},
            }, 'guild');
            if (!threadConversation) throw new ThreadConversationNotFoundError();
            return Result.success(threadConversation);

        } catch(e) {
            return Result.failure(e);
        }
    }

    async getActiveOneByMember (memberId: string): Promise<Result<IThreadConversation>> {
        try {
            const ThreadConversation = await this.repository.get({
                memberId, 
                state: {$nin: [ThreadConversationState.CLOSED, ThreadConversationState.CANCELLED]},
            }, 'guild');
            
            if (!ThreadConversation) throw new ThreadConversationNotFoundError();
            return Result.success(ThreadConversation);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async getByMember(memberId: string): Promise<Result<IThreadConversation>> {
        try {
            const ThreadConversation = await this.repository.get({memberId}, 'guild');
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

    async cancel (id: string): Promise<Result<IThreadConversation>> {
        return await this._setStatus(id, ThreadConversationState.CANCELLED);
    }
    async close (id: string): Promise<Result<IThreadConversation>> {
        return await this._setStatus(id, ThreadConversationState.CLOSED);
    }

    async _setStatus(id: string, state: ThreadConversationState): Promise<Result<IThreadConversation>> {
        try {
            const threadConversation = await this.repository.get({id});
            if (!threadConversation) throw new ThreadConversationNotFoundError();

            if (threadConversation.isWaitingAdminApproval() && state == ThreadConversationState.CANCELLED) throw new ThreadConversationAlreadyWaitingApprovalError()

            if (threadConversation.isClosed()) throw new ThreadConversationClosedAlreadyError()
            if (threadConversation.isCancelled()) throw new ThreadConversationCancelledAlreadyError()

            const ThreadConversationUpdated = await this.repository.update({id}, {state: state});
            if (!ThreadConversationUpdated) throw new ThreadConversationUpdateError();
            
            return Result.success(ThreadConversationUpdated);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async delete (id: string): Promise<Result<IThreadConversation>> {
        try {
            const ThreadConversationDeleted = await this.repository.delete({id});
            if (!ThreadConversationDeleted) throw new ThreadConversationDeletionError();
            return Result.success(ThreadConversationDeleted);
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