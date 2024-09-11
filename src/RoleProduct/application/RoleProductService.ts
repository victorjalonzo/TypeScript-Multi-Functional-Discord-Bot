import { IRepository } from "../../shared/domain/IRepository.js";
import { IPaypoint } from "../../PaypointRole/domain/IPaypointRole.js";
import { IRoleProduct } from "../domain/IRoleProduct.js";
import { Result } from "../../shared/domain/Result.js";
import { RoleProductCreationError, RoleProductDeletionError, RoleProductNotFound } from "../domain/RoleProductExceptions.js";
import { IRoleProductInput } from "../domain/IRoleProductInput.js";

export class RoleProductService implements IRoleProductInput {
    constructor(
        private repository: IRepository<IRoleProduct>
    ) {}

    create = async (roleProduct: IRoleProduct): Promise<Result<IRoleProduct>> => {
        try {
            const createdRoleProduct = await this.repository.create(roleProduct);
            if (!createdRoleProduct) throw new RoleProductCreationError();
            
            return Result.success(createdRoleProduct);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    get = async (id: string): Promise<Result<IRoleProduct>> => {
        try {
            const roleProduct = await this.repository.get({id}, 'role');
            if (!roleProduct) throw new RoleProductNotFound();
            return Result.success(roleProduct);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    getAll = async (guildId: string): Promise<Result<IRoleProduct[]>> => {
        try {
            const roleProducts = await this.repository.getAll({guildId}, 'role');
            return Result.success(roleProducts);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    delete = async (id: string): Promise<Result<IRoleProduct>> => {
        try {
            const deletedRoleProduct = await this.repository.delete({id});
            if (!deletedRoleProduct) throw new RoleProductDeletionError();
            
            return Result.success(deletedRoleProduct);
        }
        catch (e) {
            return Result.failure(e);}
    }

    deleteAll = async (guildId: string): Promise<Result<IRoleProduct[]>> => {
        try {
            const deletedRoleProducts = await this.repository.deleteAll({guildId});
            return Result.success(deletedRoleProducts);
        }
        catch (e) {
            return Result.failure(e);
        }
    }
}