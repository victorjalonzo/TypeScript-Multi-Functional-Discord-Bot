import { Config } from '../config/config.js'
import mongoose from 'mongoose'

export class Database {
    static async connect(): Promise<typeof mongoose | mongoose.Connection> {
        if (mongoose.connection.readyState === 1) return mongoose.connection.asPromise()

        console.log(Config.database.url)

        return await mongoose.connect(Config.database.url!, {
            authSource: 'admin'
        })
    }
}