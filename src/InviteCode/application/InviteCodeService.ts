import { IRepository } from "../../shared/domain/IRepository.js";
import { Result } from "../../shared/domain/Result.js";
import { IInviteCode } from "../domain/IInviteCode.js";
import { IInviteCodeInput } from "../domain/IInviteCodeInput.js";
import { InviteCodeCreationError, InviteCodeNotFoundError } from "../domain/InviteCodeExceptions.js";

export class InviteCodeService implements IInviteCodeInput {
    constructor (private repository: IRepository<IInviteCode>) {}

    async create(invideCode: IInviteCode): Promise<Result<IInviteCode>> {
        try {
            const createdInviteCode = await this.repository.create(invideCode);
            if (!createdInviteCode) throw new InviteCodeCreationError()
            return Result.success(createdInviteCode);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async getActiveOne(guildId: string): Promise<Result<IInviteCode>> {
        try {
            const inviteCode = await this.repository.get({guildId, active: true});
            if (!inviteCode) throw new InviteCodeNotFoundError()
            return Result.success(inviteCode);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async activate(code: string): Promise<Result<IInviteCode>> {
        try {
            const inviteCode = await this.repository.get({code})
            if (!inviteCode) throw new InviteCodeNotFoundError()

            await this.repository.update({guildId: inviteCode.guildId}, {active: false});

            const activatedInviteCode = await this.repository.update({code}, {active: true});

            return Result.success(<IInviteCode>activatedInviteCode);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async deactivate(guildId: string): Promise<Result<IInviteCode>> {
        try {
            const deactivatedInviteCode = await this.repository.update({guildId}, {active: false});
            if (!deactivatedInviteCode) throw new InviteCodeNotFoundError()
            return Result.success(deactivatedInviteCode);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async getByMember(memberId: string, guildId: string): Promise<Result<IInviteCode>> {
        try {
            const inviteCode = await this.repository.get({memberId, guildId});
            if (!inviteCode) throw new InviteCodeNotFoundError()
            return Result.success(inviteCode);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async getAll(guildId: string): Promise<Result<IInviteCode[]>> {
        try {
            const inviteCodes = await this.repository.getAll({guildId});
            return Result.success(inviteCodes);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async deleteByMember(memberId: string, guildId: string): Promise<Result<IInviteCode>> {
        try {
            const inviteCode = await this.repository.delete({memberId, guildId});
            if (!inviteCode) throw new InviteCodeNotFoundError()
            return Result.success(inviteCode);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async deleteAll(guild: string): Promise<Result<IInviteCode[]>> {
        try {
            const inviteCodes = await this.repository.deleteAll({guild});
            return Result.success(inviteCodes);
        }
        catch (e) {
            return Result.failure(e);
        }
    }
}