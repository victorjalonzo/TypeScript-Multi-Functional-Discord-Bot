import {ICreditWallet} from "./ICreditWallet.js"
import { Result } from "../../shared/domain/Result.js"

export interface ICreditWalletInput {
    create (creditWallet: ICreditWallet): Promise<Result<ICreditWallet>>
    update (creditWallet: ICreditWallet): Promise<Result<ICreditWallet>>
    get (memberId: string, guildId: string): Promise<Result<ICreditWallet>>
    getAll (guildId: string): Promise<Result<ICreditWallet[]>>
    deleteAll (guildId: string): Promise<Result<ICreditWallet[]>>
    decrement (memberId: string, guildId: string, credits: number): Promise<Result<number>>
    increment (memberId: string, guildId: string, credits: number): Promise<Result<number>>
}