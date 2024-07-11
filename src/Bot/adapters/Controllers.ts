import { ChannelService } from "../../Channel/application/ChannelService.js";
import { MongoChannelRepository } from "../../Channel/infrastructure/MongoChannelRepository.js";
import { ChannelController } from "../../Channel/infrastructure/ChannelController.js";

const channelRepository = new MongoChannelRepository()
const channelService = new ChannelService(channelRepository)
const channelController = new ChannelController(channelService)

export default { 
    channelController 
}