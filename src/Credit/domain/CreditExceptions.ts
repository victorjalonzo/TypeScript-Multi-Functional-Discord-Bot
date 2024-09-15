export class CreditCreationError extends Error {
    constructor() {
        super('The credit could not be created');
    }
}

export class CreditUpdateError extends Error {
    constructor() {
        super('The credit could not be updated');
    }
}

export class CreditNotFoundError extends Error {
    constructor() {
        super('The credit could not be found');
    }
}

export class CreditProductsNotFoundError extends Error {
    constructor() {
        super('The credit products could not be found');
    }
}

export class CreditDeletionError extends Error {
    constructor() {
        super('The credit could not be deleted');
    }
}

export class PriceNotProvidedError extends Error {
    constructor() {
        super('The price for the credit was not provided');
    }
}

export class CreditAmountNotProvidedError extends Error {
    constructor() {
        super('The credit amount was not provided');
    }
}