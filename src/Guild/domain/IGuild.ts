import { ICasualPayment } from "../../CasualPayment/domain/ICasualPayment.js";
import { ICredit } from "../../Credit/domain/ICredit.js";
import { IPaypoint } from "../../PaypointRole/domain/IPaypoint.js";

export interface IGuild  {
    id: string
    name: string
    icon: string | null
    createdAt: Date
    
    paypoints: IPaypoint[]
    casualPayments: ICasualPayment[]
    credits: ICredit[]

    inviteData?: unknown
}