import {describe, it, expect} from 'vitest'
import { ComponentActionData } from '../../shared/domain/ComponentActionData.js';
import { ComponentActionDataTransformer } from '../../shared/domain/ComponentActionDataTransformer.js';

describe ('ComponentActionData', () => {
    const componentActionData = new ComponentActionData({
        id: "testId",
        action: 1,
        values: {
            test: "test"
        }
    })

    const string = componentActionData.toString()

    it ('should be an instance', async () => {
        expect(componentActionData).toBeInstanceOf(ComponentActionData)
    })

    it('should return a string', async () => {
        expect(string).toBeTypeOf('string')
    })

    it('should parse a string to a ComponentActionData', async () => {
        const componentActionDataParsed = ComponentActionDataTransformer.parse(string)
        expect(componentActionDataParsed).toBeInstanceOf(ComponentActionData)
    })
    
})