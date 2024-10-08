import {describe, beforeAll, it, expect} from 'vitest'
import { createMockGuild } from "../mock/guildMock.js";

import { Database } from "../../shared/intraestructure/Database.js";
import { MongoRepository } from "../../shared/intraestructure/MongoRepository.js";
import { GuildController } from "../../Guild/infrastructure/GuildController.js";
import { GuildService } from "../../Guild/application/GuildService.js";
import { GuildModel } from '../../Guild/infrastructure/GuildSchema.js';

describe("GuildController", async () => {
    beforeAll(async () => {
        await Database.connect();
    })

    const guildRepository = new MongoRepository(GuildModel);
    const guildService = new GuildService(guildRepository);
    const guildController = new GuildController(guildService)

    const mock = createMockGuild();

    it("Create a guild record", async () => {
        expect(await guildController.createRecord(mock)).toBeTypeOf('object')
    })

    it("Update a guild record", async () => {
        const newMock = Object.assign({}, mock)
        newMock.name = "Name modified"

        expect(await guildController.updateRecord(mock, newMock)).toBeTypeOf('object')
    })

    it("Delete a guild record", async () => {
        expect(await guildController.deleteRecord(mock)).toBeTypeOf('object')
    })
})