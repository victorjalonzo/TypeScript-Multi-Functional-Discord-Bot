import { Paypoint } from "./Paypoint.js";

export interface IPaypointRepository {
    create(paypoint: Paypoint): Promise<Paypoint>
    getByRoleId(roleId: string): Promise<Paypoint | null>
    getAll(guildId: string): Promise<Paypoint | null>
    delete(guildId: string): Promise<Paypoint | null>
}