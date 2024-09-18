import { IPaypoint, TPaymentMethodType } from './IPaypoint.js';
import { IGuild } from '../../Guild/domain/IGuild.js';
import { createRandomId } from '../../shared/utils/generate.js';
import { TProductType } from '../../shared/domain/TProductType.js';

export class Paypoint implements IPaypoint {
    public id: string = createRandomId();
    public title?: string
    public description?: string
    public media?: Buffer
    public mediaCodec?: string
    public paymentMethod: TPaymentMethodType
    public productType: TProductType
    public messageId?: string | null
    public channelId?: string | null
    public guild: IGuild;
    public guildId: string;
    public createdAt: Date = new Date();

    constructor(options: Omit<IPaypoint, "id">) {
        this.title = options.title
        this.description = options.description
        this.media = options.media
        this.mediaCodec = options.mediaCodec
        this.paymentMethod = options.paymentMethod
        this.productType = options.productType
        this.messageId = options.messageId
        this.channelId = options.channelId
        this.guild = options.guild;
        this.guildId = options.guildId;
    }

    async save(): Promise<void> {}
}