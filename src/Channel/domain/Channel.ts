/*
0: TextChannel, 
2: VoiceChannel, 
4: CategoryChannel
*/

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


export class Channel implements IChannel {
    constructor (
        public name: string, 
        public id: string,
        public type: number, 
        public position: number, 
        public permissionOverwrites: Record<any, any>[] | [], 
        public createdAt: Date, 
        public parentId: string | null, 
        public guildId: string) {}
}