import { IMember } from "./IMember.js";
import { IGuild } from "../../Guild/domain/IGuild.js";

export class Member implements IMember {
    constructor (
        public id: string,
        public username: string,
        public discriminator: string,
        public guildId: string,
        public guild: IGuild,
        public avatarURL?: string | null,
        public invitedBy?: string | null
    ){}
}