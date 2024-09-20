import { Model, Document } from 'mongoose';
import { IRepository } from '../domain/IRepository.js';

export class MongoRepository<T extends Document> implements IRepository<T> {
    constructor(private readonly model: Model<T>) {}

    async getAll(filter: Record<string, any> = {}, populate: string | string[] | undefined = undefined): Promise<T[]> {
        if (!populate) return await this.model.find(filter).exec();

        if (!Array.isArray(populate)) return await this.model.find(filter).populate(populate).exec()

        let query = this.model.find(filter);

        populate.forEach((field) => {
            query = query.populate(field);
        });

        return await query.exec();
    }

    async get(filter: Record<string, any> = {}, populate: string | string[] | undefined = undefined): Promise<T | null> {
        if (!populate) return await this.model.findOne(filter)
        
        if (!Array.isArray(populate)) return await this.model.findOne(filter).populate(populate).exec()

        let query = this.model.findOne(filter);
        
        populate.forEach((field) => {
            query = query.populate(field);
        });

        return await query.exec();
    }

    async create(data: T): Promise<T> {
        const document = new this.model(data);
        await document.save();
        return document.toObject();
    }

    async update(filter: Record<string, any>, data: Partial<T>): Promise<T | null> {
        return await this.model.findOneAndUpdate(filter, data, { new: true }).exec();
    }

    async delete(filter: Record<string, any>, populate?: string[] | string): Promise<T | null> {
        if (!populate) return await this.model.findOneAndDelete(filter).exec();
        
        if (!Array.isArray(populate)) return await this.model.findOneAndDelete(filter).populate(populate).exec();

        let query = this.model.findOne(filter);
        
        populate.forEach((field) => {
            query = query.populate(field);
        });

        return await query.exec();
    }

    async deleteAll (filter: Record<string, any>, populate?: string[] | string): Promise <T[]> {
        let query = this.model.find(filter);

        if (populate) {
            if (Array.isArray(populate)) {
                populate.forEach((field) => {
                    query = query.populate(field);
                });
            } else {
                query = query.populate(populate);
            }
        }
    
        const documents = await query.exec();
    
        if (documents.length > 0) {
            await this.model.deleteMany(filter).exec();
        }
    
        return documents;
    }
}