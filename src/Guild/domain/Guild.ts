import { IGuild } from "./IGuild.js";
import { ICasualPayment } from "../../CasualPayment/domain/ICasualPayment.js";
import { ICredit } from "../../Credit/domain/ICredit.js";
import { IPaypoint } from "../../Paypoint/domain/IPaypoint.js";

export class Guild implements IGuild {
    constructor(
        public id: string,
        public name: string,
        public icon: string | null,
        public createdAt: Date,
        public paypoints: IPaypoint[] = [],
        public casualPayments: ICasualPayment[] = [],
        public credits: ICredit[] = []
    ){}
}