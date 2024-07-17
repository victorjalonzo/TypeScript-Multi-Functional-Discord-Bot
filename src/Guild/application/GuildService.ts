import { IGuildInput } from "../domain/IGuildInputPort.js";
import { Guild } from "../domain/Guild.js";

export class GuildService implements IGuildInput {
    constructor(private readonly repository: any) {}

    async getAll(): Promise<Guild[]> {
        try {
            return this.repository.getAll();
        } 
        catch (e) {
            throw e
        }
    }

    async get(id: string): Promise<Guild | null> {
        try{
            return this.repository.get(id);
        }
        catch (e) {
            throw e
        }
    }

    async create(guild: Guild): Promise<Guild> {
        try {
            return this.repository.create(guild);
        }
        catch (e) {
            throw e
        }
    }

    async update(guild: Guild): Promise<Guild> {
        try{
            return this.repository.update(guild);
        }
        catch (e) {
            throw e
        }
    }

    async delete(id: string): Promise<Guild> {
        try{
            return this.repository.delete(id);
        }
        catch (e) {
            throw e
        }
    }
}