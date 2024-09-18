import {describe, it, expect, beforeAll, afterAll} from 'vitest'
import { Services } from "../../shared/intraestructure/Container.js";
import { PaypointModel } from '../../Paypoint/infrastructure/PaypointSchema.js';

describe ('PaypointRole Service', () => {
    const { paypointService } = Services;

    it ('should get a paypoint', async () => {
        const result = await paypointService.get("1096621006686277662")
        if (!result.isSuccess()) throw result.error

        const paypoint = result.value

        expect(paypoint).toBeInstanceOf(PaypointModel)
    })
})