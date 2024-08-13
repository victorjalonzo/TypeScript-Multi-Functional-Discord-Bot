import { IMember } from "../domain/IMember.js";
import { IRepository } from "../../shared/domain/IRepository.js";
import { IMemberInput } from "../domain/IMemberInput.js"
import { Result } from "../../shared/domain/Result.js";

export class MemberService implements IMemberInput {
    constructor (private repository: IRepository<IMember>){}

    async create(member: IMember): Promise<Result<IMember>> {
        try {
            const createdMember = await this.repository.create(member);
            if (!createdMember) throw new Error(`The member record could not be created`)
            return Result.success(createdMember);
        }
        catch (e) {
            return Result.failure(String(e));
        }
    }

    async get(id: string, guildId: string): Promise<Result<IMember>> {
        try {
            const member = await this.repository.get({id, guildId});
            if (!member) throw new Error(`The member record could not be found`)
            
            return Result.success(member);
        }
        catch (e) {
            return Result.failure(String(e));
        }
    }

    async getInviteMembersCount(inviterId: string, guildId: string): Promise<Result<number>> {
        try {
            const members = await this.repository.getAll({InvitedBy: inviterId, guildId: guildId});
            const totalCount = members.length;
            
            return Result.success(totalCount);
        }
        catch (e) {
            return Result.failure(String(e));
        }
    }

    async update(data: IMember): Promise<Result<IMember>> {
        try {
            const member = await this.repository.update({id: data.id, guildId:data.guildId}, data);
            if (!member) throw new Error(`The member record could not be updated`)
            
            return Result.success(member);
        }
        catch (e) {
            return Result.failure(String(e));
        }
    }

    async delete(filters: Record<string, any>): Promise<Result<IMember>> {
        try {
            const member = await this.repository.delete(filters);
            if (!member) throw new Error(`The member record could not be deleted`)
            
            return Result.success(member);
        }
        catch (e) {
            return Result.failure(String(e));
        }
    }

}