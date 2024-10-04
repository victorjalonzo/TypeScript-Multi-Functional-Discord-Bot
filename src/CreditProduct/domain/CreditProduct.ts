import { ICreditProduct } from "./ICreditProduct.js";
import { IGuild } from "../../Guild/domain/IGuild.js";
import { createRandomId } from "../../shared/utils/IDGenerator.js";
import { ProductType } from "../../shared/domain/ProductTypeEnums.js";

interface IProps {
    credits: number,
    price: number,
    media?: Buffer,
    mediaFilename?: string,
    description?: string,
    guild: IGuild
}

export class CreditProduct implements ICreditProduct {
    public id: string = createRandomId()
    public name: string
    public price: number
    public credits: number
    public media?: Buffer | null
    public mediaFilename?: string | null
    public description?: string | null
    public type: ProductType = ProductType.CREDIT
    public guildId: string
    public guild: IGuild
    public createdAt: Date = new Date()

    constructor(props: IProps) {
        this.name = `${props.credits} credits`
        this.price = props.price
        this.credits = props.credits
        this.media = props.media
        this.mediaFilename = props.mediaFilename
        this.description = props.description
        this.guild = props.guild
        this.guildId = props.guild.id
    }
}