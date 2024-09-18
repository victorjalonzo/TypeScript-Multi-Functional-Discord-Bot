import {describe, it, expect, beforeAll, afterAll} from 'vitest'
import { Services } from "../../shared/intraestructure/Container.js";
import { RoleProductModel } from '../../RoleProduct/infrastructure/RoleProductSchema.js';
import { IPaypoint } from '../../Paypoint/domain/IPaypoint.js';

describe ('PaypointRole Service', () => {
    const { roleProductService, paypointService } = Services;

    let paypoint: IPaypoint

    beforeAll (async () => {
        const result = await paypointService.get("1096621006686277662")
        if (!result.isSuccess()) throw result.error
        paypoint = result.value
    })

    it ('should get an aray of role products.', async () => {
        const result = await roleProductService.getAll(paypoint.id)
        if (!result.isSuccess()) throw result.error

        const roleProducts = result.value
        console.log(roleProducts)

        expect(roleProducts).toBeInstanceOf(Array)
    })
})