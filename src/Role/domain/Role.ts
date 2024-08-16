import { IRole } from "./IRole.js";
import { IGuild } from "../../Guild/domain/IGuild.js";

export class Role implements IRole {
    constructor (
        public id: string,
        public name: string,
        public position: number,
        public color: number,
        public permissions: string,
        public hoist: boolean,
        public mentionable: boolean,
        public managed : boolean,
        public editable: boolean,
        public guildId: string,
        public guild: IGuild,
        public createdAt: Date = new Date()
    ){}
}