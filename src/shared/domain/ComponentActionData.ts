import {IComponentActionData} from "./IComponentActionData.js"

export class ComponentActionData implements IComponentActionData{
    public id: string
    public action: number
    public values: Record<string, any>

    constructor (options: IComponentActionData){
        this.id = options.id
        this.action = options.action
        this.values = options.values
    }

    toString(): string {
        const string = JSON.stringify(this)
        if (string.length > 100) throw new Error("The string is too long for a custom ID")
        return string
    }
}