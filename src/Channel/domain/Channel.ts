import { IChannel } from "../domain/IChannel.js";

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