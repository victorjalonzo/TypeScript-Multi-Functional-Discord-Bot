import { IGuild } from "../../Guild/domain/IGuild.js";
import { IMember } from "../../Member/domain/IMember.js";

export interface IInviteCode {
    code: string;
    memberId: string;
    member: IMember 
    active: boolean;
    createdAt: Date;
    guildId: string;
    guild: IGuild
}