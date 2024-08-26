import { IRepository } from "../../shared/domain/IRepository.js";
import { IDMConversaction } from "../domain/IDMConversaction.js";
import { Result } from "../../shared/domain/Result.js";

import { 
    DMConversactionCreationError,
    DMConversactionNotFoundError,
    DMConversactionDeletionError,
    DMConversactionUpdateError
} from "../domain/DMConversactionExceptions.js";
import { IDMConversactionInput } from "../domain/IDMConversactionInput.js";

export class DMConversactionService implements IDMConversactionInput {
    constructor(private repository: IRepository<IDMConversaction>) {}

    async create(DMConversaction: IDMConversaction): Promise<Result<IDMConversaction>> {
        try {
            const DMConversactionCreated = await this.repository.create(DMConversaction);
            if (!DMConversactionCreated) throw new DMConversactionCreationError();
            return Result.success(DMConversactionCreated);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async get(id: string): Promise<Result<IDMConversaction>> {
        try {
            const DMConversaction = await this.repository.get({id});
            if (!DMConversaction) throw new DMConversactionNotFoundError();
            return Result.success(DMConversaction);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async getByMember(memberId: string): Promise<Result<IDMConversaction>> {
        try {
            const DMConversaction = await this.repository.get({memberId});
            if (!DMConversaction) throw new DMConversactionNotFoundError();
            return Result.success(DMConversaction);
        }
        catch (e) {
            return Result.failure(e);
        }
        
    }

    async update (DMConversaction: IDMConversaction): Promise<Result<IDMConversaction>> {
        try {
            const DMConversactionUpdated = await this.repository.update({id: DMConversaction.id}, DMConversaction);
            if (!DMConversactionUpdated) throw new DMConversactionUpdateError();
            return Result.success(DMConversactionUpdated);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async delete (memberId: string): Promise<Result<IDMConversaction>> {
        try {
            const DMConversactionDeleted = await this.repository.delete({memberId});
            if (!DMConversactionDeleted) throw new DMConversactionDeletionError();
            return Result.success(DMConversactionDeleted);
        }
        catch (e) {
            return Result.failure(e);
        }
    }
}