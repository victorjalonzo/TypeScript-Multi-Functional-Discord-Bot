export class RoleProductCreationError extends Error {
    constructor() {
        super('The role product could not be created');
    }
}

export class RoleProductDeletionError extends Error {
    constructor() {
        super('The role product could not be deleted');
    }
}