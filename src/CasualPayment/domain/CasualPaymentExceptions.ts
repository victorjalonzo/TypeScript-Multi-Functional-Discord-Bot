export class CasualPaymentCreationError extends Error {
    constructor() {
        super('The paypoint could not be created');
    }
}

export class CasualPaymentUpdateError extends Error {
    constructor() {
        super('The paypoint could not be updated');
    }
}

export class CasualPaymentDeletionError extends Error {
    constructor() {
        super('The paypoint could not be deleted');
    }
}

export class CasualPaymentNotFoundError extends Error {
    constructor() {
        super('The paypoint could not be found');
    }
}

export class MethodNotProvidedError extends Error {
    constructor() {
        super('The method was not provided');
    }
}

export class ValueNotProvidedError extends Error {
    constructor() {
        super('The value for the method was not provided');
    }
}