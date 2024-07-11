import { Database } from "../../shared/intraestructure/database.js";
import { ChannelService } from "../../Channel/application/ChannelService.js";
import { MongoChannelRepository } from "../../Channel/infrastructure/MongoChannelRepository.js";
import { ChannelController } from "../../Channel/infrastructure/ChannelController.js";
import {describe, beforeAll, it, expect} from 'vitest'
import { createMockTextChannel } from "../mock/textChannelMock.js";

describe('ChannelController', () => {

    beforeAll(async () => {
        await Database.connect();
    })

    const channelRepository = new MongoChannelRepository()
    const channelService = new ChannelService(channelRepository);
    const channelController = new ChannelController(channelService)
    
    const mockChannel = createMockTextChannel()

    it("Create a channel record", async () => {

        expect(
            await channelController.createChannel(mockChannel)
        ).toBeUndefined()
    })

    it("Update a channel record", async () => {
        const newMockChannel = createMockTextChannel()

        expect(
            await channelController.updateChannel(mockChannel, newMockChannel)
        ).toBeUndefined()
    })

    it("Delete a channel record", async () => {
        expect(
            await channelController.deleteChannel(mockChannel)
        ).toBeUndefined()
    })
})