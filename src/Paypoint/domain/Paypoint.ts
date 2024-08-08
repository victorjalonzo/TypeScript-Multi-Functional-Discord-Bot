import { IPaypoint } from './IPaypoint.js';
import { IGuild } from '../../Guild/domain/IGuild.js';
import { createRandomId } from '../../shared/utils/generate.js';

export class Paypoint implements IPaypoint {
    public id: string = createRandomId();
    public createdAt: Date = new Date();

    constructor (
        public image: string,
        public title: string,
        public description: string,
        public payment_method_type: "Casual" | "Integrated" | "Both",
        public sale_type: "Credit" | "Roles",
        public guildId: string,
        public guild: IGuild,
        public messageId?: string,
        public channelId?: string,
    ) {}
}