import {describe, beforeAll, it, expect} from 'vitest'
import { createMockGuild } from "../mock/guildMock.js";

import { Database } from "../../shared/intraestructure/Database.js";
import { MongoRepository } from "../../shared/intraestructure/MongoRepository.js";
import { GuildController } from "../../Guild/intrastructure/GuildController.js";
import { GuildService } from "../../Guild/application/GuildService.js";
import { GuildModel } from '../../Guild/intrastructure/GuildSchema.js';

describe("GuildController", async () => {
    beforeAll(async () => {
        await Database.connect();
    })

    const guildRepository = new MongoRepository(GuildModel);
    const guildService = new GuildService(guildRepository);
    const guildController = new GuildController(guildService)

    const mock = createMockGuild();
    console.log(mock)

    it("Create a guild record", async () => {
        await guildController.createRecord(mock)
    })

    it("Update a guild record", async () => {
        const newMock = createMockGuild()
        newMock.name = "Name modified"

        await guildController.updateRecord(mock, newMock)
    })
})