import { ICreditChannelLocker } from "./ICreditChannelLock.js"
import { Result } from "../../shared/domain/Result.js"

export interface ICreditChannelLockerInput {
    create: (props: ICreditChannelLocker) => Promise<Result<ICreditChannelLocker>>
    getAll: (guildId: string) => Promise<Result<ICreditChannelLocker[]>>
    get: (id: string) => Promise<Result<ICreditChannelLocker>>
    update: (props: ICreditChannelLocker) => Promise<Result<ICreditChannelLocker>>
    deleteAll: (guildId: string) => Promise<Result<ICreditChannelLocker[]>>
}