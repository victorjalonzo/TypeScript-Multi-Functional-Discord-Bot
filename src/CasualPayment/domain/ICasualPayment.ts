import { IGuild } from "../../Guild/domain/IGuild.js";
import { CasualPaymentMethodType } from "./CasualPaymentMethodType.js";

export interface ICasualPayment {
    id: string
    name: CasualPaymentMethodType
    value: string
    guildId: string
    guild: IGuild
    rawName: string
}