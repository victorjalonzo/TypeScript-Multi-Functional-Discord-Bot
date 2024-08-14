import { IMember } from "../domain/IMember.js";
import { IRepository } from "../../shared/domain/IRepository.js";
import { IMemberInput } from "../domain/IMemberInput.js"
import { Result } from "../../shared/domain/Result.js";

import { 
    MemberAlreadyExistsError, 
    MemberCreationError,
    MemberNotFoundError,
    MemberUpdateError,
    MemberDeletionError
    
} from "../domain/MemberExceptions.js";

export class MemberService implements IMemberInput {
    constructor (private repository: IRepository<IMember>){}

    async create(member: IMember): Promise<Result<IMember>> {
        try {
            const existingMember = await this.repository.get({id: member.id, guildId: member.guildId});
            if (existingMember) throw new MemberAlreadyExistsError()

            const createdMember = await this.repository.create(member);
            if (!createdMember) throw new MemberCreationError()
            return Result.success(createdMember);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async get(id: string, guildId: string): Promise<Result<IMember>> {
        try {
            const member = await this.repository.get({id, guildId});
            if (!member) throw new MemberNotFoundError()
            
            return Result.success(member);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async getInviteMembersCount(inviterId: string, guildId: string): Promise<Result<number>> {
        try {
            const members = await this.repository.getAll({invitedBy: inviterId, guildId: guildId});
            const totalCount = members.length;
            
            return Result.success(totalCount);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async update(data: IMember): Promise<Result<IMember>> {
        try {
            const member = await this.repository.update({id: data.id, guildId:data.guildId}, data);
            if (!member) throw new MemberUpdateError()
            
            return Result.success(member);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    async delete(filters: Record<string, any>): Promise<Result<IMember>> {
        try {
            const member = await this.repository.delete(filters);
            if (!member) throw new MemberDeletionError()
            
            return Result.success(member);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

}