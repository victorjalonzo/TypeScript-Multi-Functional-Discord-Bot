export class CreditProductCreationError extends Error {
    constructor() {
        super('The credit could not be created');
    }
}

export class CreditProductUpdateError extends Error {
    constructor() {
        super('The credit could not be updated');
    }
}

export class CreditProductNotFoundError extends Error {
    constructor() {
        super('The credit could not be found');
    }
}

export class CreditProductsNotFoundError extends Error {
    constructor() {
        super('The credit products could not be found');
    }
}

export class CreditProductDeletionError extends Error {
    constructor() {
        super('The credit could not be deleted');
    }
}

export class CreditProductPriceNotProvidedError extends Error {
    constructor() {
        super('The price for the credit was not provided');
    }
}

export class CreditProductAmountNotProvidedError extends Error {
    constructor() {
        super('The credit amount was not provided');
    }
}