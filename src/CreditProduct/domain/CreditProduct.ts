import { ICreditProduct } from "./ICreditProduct.js";
import { IGuild } from "../../Guild/domain/IGuild.js";
import { createRandomId } from "../../shared/utils/generate.js";

export class CreditProduct implements ICreditProduct {
    public id: string = createRandomId()
    public name: string
    public price: number
    public credits: number
    public media?: Buffer | null
    public mediaFilename?: string | null
    public description?: string | null
    public guildId: string
    public guild: IGuild
    public createdAt: Date = new Date()

    constructor(props: Omit<ICreditProduct, "id" | "name" | "createdAt">) {
        this.price = props.price
        this.credits = props.credits
        this.media = props.media
        this.mediaFilename = props.mediaFilename
        this.description = props.description
        this.guildId = props.guildId
        this.guild = props.guild

        this.name = `${props.credits} Credits`
    }
}