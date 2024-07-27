import { ICasualPayment } from "../../CasualPayment/domain/ICasualPayment.js";

export interface IGuild  {
    id: string
    name: string
    icon: string | null
    createdAt: Date
    casualPayments: ICasualPayment[]
}