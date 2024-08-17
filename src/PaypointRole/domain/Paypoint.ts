import { IPaypoint, TPaymentMethodType } from './IPaypoint.js';
import { IRoleProduct } from '../../RoleProduct/domain/IRoleProduct.js';
import { IGuild } from '../../Guild/domain/IGuild.js';
import { createRandomId } from '../../shared/utils/generate.js';

export class Paypoint implements IPaypoint {
    public id: string = createRandomId();
    public title?: string
    public description?: string
    public image?: string
    public products: IRoleProduct[] = [];
    public paymentMethod?: TPaymentMethodType
    public messageId?: string
    public channelId?: string
    public guild: IGuild;
    public guildId: string;
    public createdAt: Date = new Date();

    constructor(options: Omit<IPaypoint, "products" | "id">) {
        this.title = options.title
        this.description = options.description
        this.image = options.image
        this.paymentMethod = options.paymentMethod
        this.messageId = options.messageId
        this.channelId = options.channelId
        this.guild = options.guild;
        this.guildId = options.guildId;
    }

    async save(): Promise<void> {}
}