import { IGuild } from "../../Guild/domain/IGuild.js";
import { ICasualPayment } from "../domain/ICasualPayment.js";
import { ICasualPaymentInput } from "../domain/ICasualPaymentInput.js";
import { IRepository } from "../../shared/domain/IRepository.js";
import { Result } from "../../shared/domain/Result.js";

export class CasualPaymentService implements ICasualPaymentInput {
    constructor (
        private repository: IRepository<ICasualPayment>,
        private guildRepository: IRepository<IGuild>
    ) {}
    
    create = async (casualPayment:ICasualPayment): Promise<Result<ICasualPayment>> => {
        try {
            const createdCasualPayment = await this.repository.create(casualPayment);

            if (!createdCasualPayment) throw new Error(`The casual payment record could not be created`)
            
            const guild = await this.guildRepository.get({ id: casualPayment.guild.id });

            if (!guild) throw new Error(`The guild record ${casualPayment.guild.name} (${casualPayment.guild.id}) could not be found.`)

            guild.casualPayments.push(createdCasualPayment);
            await this.guildRepository.update({id: guild.id },  guild);
        
            return Result.success(createdCasualPayment);
        }
        catch(e) {
            return Result.failure(String(e));
        }
    }
}