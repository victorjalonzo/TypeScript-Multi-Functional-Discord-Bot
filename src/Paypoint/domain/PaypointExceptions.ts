export class MissingCasualPaymentMethodsError extends Error {
    constructor() {
        super('The guild must have at least one casual payment');
    }
}

export class PaymentMethodNotProvidedError extends Error {
    constructor() {
        super('The payment method was not provided');
    }
}

export class PaypointPaymentMethodNotChosenError extends Error {
    constructor() {
        super('The payment method type was not chosen for this paypoint');
    }
}

export class PaypointProductTypeNotChosenError extends Error {
    constructor() {
        super('There product type was not chosen for this paypoint');
    }
}

export class MissingCasualPaymentMethod extends Error {
    constructor() {
        super('The guild must have at least one casual payment');
    }
}

export class MissingIntegratedPaymentMethod extends Error {
    constructor() {
        super('The guild must have at least one integrated payment');
    }
}

export class PaypointCreationError extends Error {
    constructor() {
        super('The paypoint could not be created');
    }
}

export class PaypointUpdateError extends Error {
    constructor() {
        super('The paypoint could not be updated');
    }
}

export class PaypointNotFoundError extends Error {
    constructor() {
        super('The paypoint could not be found');
    }
}

export class PaypointDeletionError extends Error {
    constructor() {
        super('The paypoint could not be deleted');
    }
}

export class ProductTypeNotSupported extends Error {
    constructor() {
        super('The product type is not supported');
    }
}