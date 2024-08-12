import { IRewardRole } from "./IRewardRole.js";
import { IGuild } from "../../Guild/domain/IGuild.js";
import { createRandomId } from "../../shared/utils/generate.js";

export class RewardRole implements IRewardRole {
    constructor(
        public roleId: string,
        public invites: number,
        public guildId: string,
        public guild: IGuild,
        public createdAt: Date = new Date(),
        public id: string = createRandomId(),
    ){}
}