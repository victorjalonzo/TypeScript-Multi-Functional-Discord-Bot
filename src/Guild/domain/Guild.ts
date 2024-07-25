import { IGuild } from "./IGuild.js";
import { ICasualPayment } from "../../CasualPayment/domain/ICasualPayment.js";

export class Guild implements IGuild {
    constructor(
        public id: string,
        public name: string,
        public icon: string | null,
        public createdAt: Date,
        public casualPayments: ICasualPayment[] = [],
    ){}
}