import { ICasualPayment } from "../../CasualPayment/domain/ICasualPayment.js";
import { ICredit } from "../../Credit/domain/ICredit.js";
import { IPaypoint } from "../../PaypointRole/domain/IPaypointRole.js";
import { IRole } from "../../Role/domain/IRole.js";

export interface IGuild  {
    id: string
    name: string
    icon: string | null
    defaultCredits: number
    defaultRole?: IRole | null
    defaultNotificationChannel?: IRole | null
    defaultInvoiceChannel?: IRole | null
    createdAt: Date
    paypoints: IPaypoint[]
    casualPayments: ICasualPayment[]
    credits: ICredit[]

    inviteData?: unknown
}