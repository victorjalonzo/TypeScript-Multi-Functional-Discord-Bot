import { ICasualPayment } from "../../CasualPayment/domain/ICasualPayment.js";
import { ICreditProduct } from "../../CreditProduct/domain/ICreditProduct.js";
import { IPaypoint } from "../../Paypoint/domain/IPaypoint.js";
import { IRole } from "../../Role/domain/IRole.js";
import { ITextChannel } from "../../TextChannel/domain/ITextChannel.js";

export interface IGuild  {
    id: string
    name: string
    icon: string | null
    defaultCredits: number
    defaultRole?: IRole | null
    defaultNotificationChannel?: ITextChannel | null
    defaultInvoiceChannel?: ITextChannel | null
    createdAt: Date
    paypoints: IPaypoint[]
    casualPayments: ICasualPayment[]
    credits: ICreditProduct[]

    inviteData?: unknown
}