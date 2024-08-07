import { ICasualPayment } from "./ICasualPayment.js";
import { TPaymentMethods } from "./ICasualPayment.js";
import { IGuild } from "../../Guild/domain/IGuild.js";

export class CasualPayment implements ICasualPayment {

    constructor(
        public name: TPaymentMethods,
        public value: string,
        public guildId: string,
        public guild: IGuild,
        public rawName: string = name.split(" ").join("").toLowerCase()
    ){}
}
