import { IGuild } from "../../Guild/domain/IGuild.js";
import { ICachedGuild } from "../../shared/intraestructure/ICachedGuild.js";

export type TPaymentMethods = "Cash App" | "Zelle" | "Paypal" | "Venmo" | "Apple Pay" | "Google Pay";

export interface ICasualPayment {
    name: TPaymentMethods
    value: string
    guildId: string
    guild: IGuild | ICachedGuild
    rawName: string
}
