import { IPaypoint, TPaymentMethodType } from './IPaypoint.js';
import { IGuild } from '../../Guild/domain/IGuild.js';
import { createRandomId } from '../../shared/utils/IDGenerator.js';
import { ProductType } from '../../shared/domain/ProductTypeEnums.js';

interface IProps extends Omit <
        IPaypoint,
        "id" |
        "isBasedOnCreditProduct" | 
        "isBasedOnRoleProduct"
    >{}

export class Paypoint implements IPaypoint {
    public id: string = createRandomId();
    public title?: string
    public description?: string
    public media?: Buffer
    public mediaCodec?: string
    public paymentMethod: TPaymentMethodType
    public productType: ProductType
    public messageId?: string | null
    public channelId?: string | null
    public guild: IGuild;
    public guildId: string;
    public createdAt: Date = new Date();

    constructor(props: IProps) {
        this.title = props.title
        this.description = props.description
        this.media = props.media
        this.mediaCodec = props.mediaCodec
        this.paymentMethod = props.paymentMethod
        this.productType = props.productType
        this.messageId = props.messageId
        this.channelId = props.channelId
        this.guild = props.guild;
        this.guildId = props.guildId;
    }

    async save(): Promise<void> {}

    isBasedOnCreditProduct(): boolean {
        if (this.productType == ProductType.CREDIT) return true 
        return false
    }

    isBasedOnRoleProduct(): boolean {
        if (this.productType == ProductType.ROLE) return true
        return false
    }
}