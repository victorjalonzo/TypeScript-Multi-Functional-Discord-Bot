import { IComponentActionData } from "./IComponentActionData.js";

export interface IComponentAction {
    id: string,
    execute: (interaction: any, data: IComponentActionData) => Promise<unknown>
}