import { ComponentActionData } from "./ComponentActionData.js";
import { IComponentActionData } from "./IComponentActionData.js";

export class ComponentActionDataTransformer {
    static parse = (data: string): IComponentActionData => {
        const obj =  JSON.parse(data)
        return new ComponentActionData(obj)
    }
}