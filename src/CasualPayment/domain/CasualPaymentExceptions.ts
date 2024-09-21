export class CasualPaymentCreationError extends Error {
    constructor() {
        super('The casual method could not be created');
    }
}

export class CasualPaymentUpdateError extends Error {
    constructor() {
        super('The casual method could not be updated');
    }
}

export class CasualPaymentDeletionError extends Error {
    constructor() {
        super('The casual method could not be deleted');
    }
}

export class CasualPaymentNotFoundError extends Error {
    constructor() {
        super('The casual method could not be found');
    }
}

export class GuildIdMissingException extends Error {
    constructor() {
        super('The guild id was not provided');
    }
}

export class CasualPaymentMethodsMissingException extends Error {
    constructor() {
        super('The methods were not provided');
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