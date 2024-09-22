import { IRepository } from "../../shared/domain/IRepository.js";
import { Result } from "../../shared/domain/Result.js";
import { IInvitePoint } from "../domain/IInvitePoint.js";

import { 
    InvitePointCreationError,
    InvitePointNotFoundError,
    InvitePointUpdateError
} from "../domain/InvitePointExceptions.js";

export class InvitePointService {
    constructor (private repository: IRepository<IInvitePoint>) {}

    async create (invitePoint: IInvitePoint): Promise<Result<IInvitePoint>> {
        try {
            const invitePointCreated = await this.repository.create(invitePoint);
            if (!invitePointCreated) throw new InvitePointCreationError()

            return Result.success(invitePointCreated);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async get (guildId: string): Promise<Result<IInvitePoint>> {
        try {
            const invitePoint = await this.repository.get({guildId});
            if (!invitePoint) throw new InvitePointNotFoundError()
            return Result.success(invitePoint);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async update (invitePoint: IInvitePoint): Promise<Result<IInvitePoint>> {
        try {
            const invitePointUpdated = await this.repository.update({guildId: invitePoint.guildId}, invitePoint);
            if (!invitePointUpdated) throw new InvitePointUpdateError()
            return Result.success(invitePointUpdated);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async delete (guildId: string): Promise<Result<IInvitePoint>> {
        try {
            const invitePoint = await this.repository.delete({guildId});
            if (!invitePoint) throw new InvitePointNotFoundError()
            return Result.success(invitePoint);
        }
        catch (e) {
            return Result.failure(e);
        }
    }
}