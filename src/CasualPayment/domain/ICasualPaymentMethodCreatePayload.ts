import { CasualPaymentMethodType } from "./CasualPaymentMethodType.js"

interface IPartialCasualPaymentMethod {
    paymentMethodName: CasualPaymentMethodType
    paymentMethodValue: string | string[]
}

export interface ICasualPaymentMethodCreatePayload {
    guildId: string 
    casualPaymentMethods: IPartialCasualPaymentMethod[]
}