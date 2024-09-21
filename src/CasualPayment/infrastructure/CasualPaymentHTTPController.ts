import { IGuildInput } from "../../Guild/domain/IGuildInput.js";
import { CasualPayment } from "../domain/CasualPayment.js";
import { ICasualPaymentInput } from "../domain/ICasualPaymentInput.js";
import {Response, Request} from "express";
import { ICasualPayment, TPaymentMethods } from "../domain/ICasualPayment.js";
import { CasualPaymentModel } from "./CasualPaymentSchema.js";
import { Document } from "mongoose";

interface IPartialCasualPaymentMethod {
    paymentMethodName: TPaymentMethods
    paymentMethodValue: string | string[]
}

export class CasualPaymentHTTPController {
    constructor (
        private service: ICasualPaymentInput,
        private guildService: IGuildInput
    ) {}

    async create(req: Request, res: Response) {
        try {
            if (!req.body.guildId) throw new Error("Guild Id not provided")
            if (!req.body.casualPaymentMethods) throw new Error("Casual payment methods not provided")

            const guildCachedResult = await this.guildService.get(req.body.guildId);
            if (!guildCachedResult.isSuccess()) throw guildCachedResult.error
            
            const guildCached = guildCachedResult.value

            const result = await this.service.deleteAll(req.body.guildId);
            if (!result.isSuccess()) throw result.error

            const partialPaymentMethods: IPartialCasualPaymentMethod[] = req.body.casualPaymentMethods

            const casualPaymentMethodsCreateds: Document<ICasualPayment>[] = []

            for (const method of partialPaymentMethods) {
                const values = Array.isArray(method.paymentMethodValue)
                ? method.paymentMethodValue
                : [method.paymentMethodValue]

                for (const value of values) {
                    const newCasualPayment = new CasualPayment({
                        name: method.paymentMethodName,
                        value:value,
                        guild: guildCached,
                        guildId: req.body.guildId
                    })

                    const result = await this.service.create(newCasualPayment);
                    if (!result.isSuccess()) throw result.error

                    const casualPaymentCreated = <Document<ICasualPayment>><unknown>result.value

                    casualPaymentMethodsCreateds.push(casualPaymentCreated)
                }
            }
            res.status(201).json({casualPaymentMethodsCreateds});

        } catch (error) {
            res.status(500).json({error: String(error)});
        }
    }
}