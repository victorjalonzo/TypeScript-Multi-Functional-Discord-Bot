export interface ICreditChannelLocker {
	id: string
	sourceChannelId: string 
	updatableMessageId: string 
	price: number
	description?: string | null
	media?: Buffer | null 
    mediaCodec?: string | null
}