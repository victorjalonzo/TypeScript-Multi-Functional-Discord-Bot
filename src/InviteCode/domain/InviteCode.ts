import { IGuild } from "../../Guild/domain/IGuild.js";
import { IMember } from "../../Member/domain/IMember.js";
import { generateCode } from "../../shared/utils/CodeGenerator.js";
import { IInviteCode } from "./IInviteCode.js";

interface IProps extends Omit<IInviteCode, 'code' | 'createdAt' | 'active' | 'memberId' | 'guildId'> {}

export class InviteCode implements IInviteCode {
    code: string = generateCode(8)
    active: boolean = false 
    memberId: string
    member: IMember
    guildId: string
    guild: IGuild
    createdAt: Date = new Date()

    constructor (props: IProps) {
        this.member = props.member
        this.guild = props.guild
        this.memberId = props.member.id
        this.guildId = props.guild.id
    }
}