export class RoleProductCreationError extends Error {
    constructor() {
        super('The role product could not be created');
    }
}

export class RoleProductNotFound extends Error {
    constructor() {
        super('The role product was not found');
    }
}

export class RoleProductDeletionError extends Error {
    constructor() {
        super('The role product could not be deleted');
    }
}