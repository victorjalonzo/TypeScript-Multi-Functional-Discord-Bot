import { IGuild } from "./IGuild.js";
import { ICasualPayment } from "../../CasualPayment/domain/ICasualPayment.js";
import { ICredit } from "../../Credit/domain/ICredit.js";
import { IPaypoint } from "../../PaypointRole/domain/IPaypointRole.js";

export class Guild implements IGuild {
    inviteData: unknown

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