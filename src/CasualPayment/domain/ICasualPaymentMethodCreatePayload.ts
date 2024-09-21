import { TPaymentMethods } from "./ICasualPayment.js"

interface IPartialCasualPaymentMethod {
    paymentMethodName: TPaymentMethods
    paymentMethodValue: string | string[]
}

export interface ICasualPaymentMethodCreatePayload {
    guildId: string 
    casualPaymentMethods: IPartialCasualPaymentMethod[]
}