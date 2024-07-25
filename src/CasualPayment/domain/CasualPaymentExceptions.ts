import { CustomException } from "../../shared/domain/CustomException.js";

export class CreateCasualPaymentError extends CustomException {
    constructor(casualPayment: Record<string, any>, dueTo?: string) {
        super({
            message:`The method ${casualPayment.name} with value ${casualPayment.value} could not be set as an casual payment method.`,
            dueTo: dueTo
        });
    }
}