import { IRepository } from "../../shared/domain/IRepository.js";
import { IPaypoint } from "../../PaypointRole/domain/IPaypoint.js";
import { IRoleProduct } from "../domain/IRoleProduct.js";
import { Result } from "../../shared/domain/Result.js";
import { RoleProductCreationError, RoleProductDeletionError } from "../domain/RoleProductExceptions.js";
import { IRoleProductInput } from "../domain/IRoleProductInput.js";

export class RoleProductService implements IRoleProductInput {
    constructor(
        private repository: IRepository<IRoleProduct>,
        private paypointRepository: IRepository<IPaypoint>
    ) {}

    create = async (roleProduct: IRoleProduct): Promise<Result<IRoleProduct>> => {
        try {
            const createdRoleProduct = await this.repository.create(roleProduct);
            if (!createdRoleProduct) throw new RoleProductCreationError();

            const { paypoint } = roleProduct
            roleProduct.paypoint.products.push(createdRoleProduct);

            const updatedPaypoint = await this.paypointRepository.update({id: paypoint.id}, {products: paypoint.products});
            if (!updatedPaypoint) throw new Error("The paypoint could not be found");

            createdRoleProduct.paypoint = updatedPaypoint
            
            return Result.success(createdRoleProduct);
        }
        catch (e) {
            return Result.failure(e);
        }
    }

    getAll = async (paypointId: string): Promise<Result<IRoleProduct[]>> => {
        try {
            const roleProducts = await this.repository.getAll({paypointId}, 'role');
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

            const { paypoint } = deletedRoleProduct
            paypoint.products = paypoint.products.filter(product => product.id !== id);
            const updatedPaypoint = await this.paypointRepository.update({id: paypoint.id}, {products: paypoint.products});
            if (!updatedPaypoint) throw new Error("The paypoint could not be found");
            
            return Result.success(deletedRoleProduct);
        }
        catch (e) {
            return Result.failure(e);}
    }
}