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

export class RoleProductsNotFound extends Error {
    constructor() {
        super('The role products were not found');
    }
}

export class RoleProductDeletionError extends Error {
    constructor() {
        super('The role product could not be deleted');
    }
}


export class RoleProductNotPrividedError extends Error {
    constructor() {
        super('The role product was not provided');
    }
}

export class RoleProductPriceNotPrividedError extends Error {
    constructor() {
        super('The price for the role product was not provided');
    }
}

export class RoleProductInvalidPriceError extends Error {
    constructor() {
        super('The price for the role product is invalid');
    }
}