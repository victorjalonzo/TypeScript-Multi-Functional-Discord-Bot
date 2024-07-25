import { IGuild } from "../../Guild/domain/IGuild.js";

export type TPaymentMethods = "Cash App" | "Zelle" | "Paypal" | "Venmo" | "Apple Pay" | "Google Pay";

export interface ICasualPayment {
    name: TPaymentMethods
    value: string
    guild: IGuild
}