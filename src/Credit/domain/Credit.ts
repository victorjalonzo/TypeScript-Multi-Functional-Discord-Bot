import { ICredit } from "./ICredit.js";
import { IGuild } from "../../Guild/domain/IGuild.js";

export class Credit implements ICredit {
    constructor(
        public price: number,
        public amount: number,
        public guildId: string,
        public guild: IGuild,
        public createdAt: Date
    ) {}
}