import { ICredit } from "./ICredit.js";
import { IGuild } from "../../Guild/domain/IGuild.js";
import { createRandomId } from "../../shared/utils/generate.js";

export class Credit implements ICredit {
    public id: string = createRandomId()
    public price: number
    public amount: number
    public media?: Buffer | null
    public codec?: string | null
    public description?: string | null
    public guildId: string
    public guild: IGuild
    public createdAt: Date = new Date()

    constructor(props: Omit<ICredit, "id" | "createdAt">) {
        this.price = props.price
        this.amount = props.amount
        this.media = props.media
        this.codec = props.codec
        this.description = props.description
        this.guildId = props.guildId
        this.guild = props.guild
    }
}