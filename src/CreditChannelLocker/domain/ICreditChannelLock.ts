import { IGuild } from "../../Guild/domain/IGuild.js"

export interface ICreditChannelLocker {
	id: string
	sourceChannelId: string 
	price: number
	updatableMessageId?: string 
	description?: string
	media?: Buffer
    mediaCodec?: string
	guild: IGuild
	guildId: string
}