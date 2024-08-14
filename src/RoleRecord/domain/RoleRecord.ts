import { IRoleRecord } from "./IRoleRecord.js";
import { createRandomId } from "../../shared/utils/generate.js";
import { IGuild } from "../../Guild/domain/IGuild.js";

export class RoleRecord implements IRoleRecord {
    constructor (
        public id: string,
        public name: string,
        public position: number,
        public color: number, 
        public guildId: string,
        public guild: IGuild,
    ){}
}