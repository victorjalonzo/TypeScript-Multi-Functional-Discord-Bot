import { ICasualPayment } from "./ICasualPayment.js";
import { TPaymentMethods } from "./ICasualPayment.js";
import { IGuild } from "../../Guild/domain/IGuild.js";
import { createRandomId } from "../../shared/utils/generate.js";

export class CasualPayment implements ICasualPayment {
    public id: string = createRandomId()
    public name: TPaymentMethods
    public value: string
    public guildId: string
    public guild: IGuild
    public rawName: string

    constructor(options: Omit<ICasualPayment, "id"| "rawName">){
        this.name = options.name
        this.value = options.value
        this.guildId = options.guildId
        this.guild = options.guild

        this.rawName = this.name.split(" ").join("").toLowerCase()
    }
}
