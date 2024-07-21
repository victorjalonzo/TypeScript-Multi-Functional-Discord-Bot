export interface IChannel {
    name: string
    id: string
    type: number
    position: number
    permissionOverwrites: Record<any, any>[] | []
    createdAt: Date
    parentId: string | null
    guildId: string
}