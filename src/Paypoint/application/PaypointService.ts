import { IPaypointRepository } from "../domain/IPaypointRepository.js";
import { IPaypoint, Paypoint } from "../domain/Paypoint.js";
import { PaypointCanNotBeCreated, PaypointCannotBeRetrieved, PaypointCanNotBeDeleted} from "../domain/PaypointExceptions.js";

export class PaypointService {
    constructor(private repository: IPaypointRepository) {}

    async create(props: IPaypoint): Promise<Paypoint> {
        //const existingPaypoint = await this.repository.getByRoleId(props);

        //if (existingPaypoint) throw new PaypointCanNotBeCreated('The paypoint under the role: ${props.roleId} already exists');

        try {
            return await this.repository.create(props);
        }
        catch (e) {
            throw new PaypointCanNotBeCreated(String(e));
        }
    }

    async getAll(guildId: string): Promise<Paypoint | null> {
        try {
            return await this.repository.getAll(guildId);
        }
        catch (e) {
            throw new PaypointCannotBeRetrieved(String(e));
        }
    }

    async delete(guildId: string): Promise<Paypoint | null> {
        try {
            return await this.repository.delete(guildId);
        }
        catch(e) {
            throw new PaypointCanNotBeDeleted(String(e));
        }
    }
}