import { IGuild } from "../../Guild/domain/IGuild.js";
import { ICachedGuild } from "../../shared/intraestructure/ICachedGuild.js";
import { CasualPaymentMethodType } from "./CasualPaymentMethodType.js";

export interface ICasualPayment {
    id: string
    name: CasualPaymentMethodType
    value: string
    guildId: string
    guild: IGuild | ICachedGuild
    rawName: string
}