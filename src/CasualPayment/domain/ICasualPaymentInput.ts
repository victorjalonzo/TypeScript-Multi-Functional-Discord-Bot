import { ICasualPayment } from "./ICasualPayment.js";
import { Result } from "../../shared/domain/Result.js";

export interface ICasualPaymentInput {
    create(casualPayment: ICasualPayment): Promise<Result<ICasualPayment>>
}