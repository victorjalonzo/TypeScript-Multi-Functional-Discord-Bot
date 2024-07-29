import { ICasualPayment } from "../../CasualPayment/domain/ICasualPayment.js";
import { ICredit } from "../../Credit/domain/ICredit.js";

export interface IGuild  {
    id: string
    name: string
    icon: string | null
    createdAt: Date
    
    casualPayments: ICasualPayment[]
    credits: ICredit[]
}