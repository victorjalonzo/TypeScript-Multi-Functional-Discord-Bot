export interface IPaypoint {
    id: string
    image: string
    channelId: string
    product: {roleId: string, price: number}[]
    guildId: string
    invoiceChannelId?: string
    createdAt: Date
}

export class Paypoint implements IPaypoint {
    constructor (
        public id: string,
        public image: string,
        public product: {roleId: string, price: number}[],
        public channelId: string,
        public guildId: string,
        public createdAt: Date,
        public invoiceChannelId?: string,
    ) {}
}