import { DeleteResult } from 'mongodb';
import { Model, Document } from 'mongoose';
import { IRepository } from '../domain/IRepository.js';

export class MongoRepository<T extends Document> implements IRepository<T> {
    constructor(private readonly model: Model<T>) {}

    async getAll(filter: Record<string, any> = {}): Promise<T[]> {
        return await this.model.find(filter)
    }

    async get(filter: Record<string, any>): Promise<T | null> {
        return await this.model.findOne(filter)
    }

    async create(data: T): Promise<T> {
        const document = new this.model(data);
        await document.save();
        return document.toObject();
    }

    async update(filter: Record<string, any>, data: Partial<T>): Promise<T | null> {
        return await this.model.findOneAndUpdate(filter, data, { new: true }).exec();
    }

    async delete(filter: Record<string, any>): Promise<DeleteResult> {
        return await this.model.deleteOne(filter).exec();
    }
}