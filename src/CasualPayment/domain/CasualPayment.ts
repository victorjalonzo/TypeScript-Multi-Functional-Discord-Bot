import { ICasualPayment } from "./ICasualPayment.js";
import { TPaymentMethods } from "./ICasualPayment.js";
import { IGuild } from "../../Guild/domain/IGuild.js";

export class CasualPayment implements ICasualPayment {
    name: TPaymentMethods
    value: string
    guildId: string
    guild: IGuild
    rawName: string

    constructor(options: Omit<ICasualPayment, "rawName">){
        this.name = options.name
        this.value = options.value
        this.guildId = options.guildId
        this.guild = options.guild

        this.rawName = this.name.split(" ").join("").toLowerCase()
    }
}
