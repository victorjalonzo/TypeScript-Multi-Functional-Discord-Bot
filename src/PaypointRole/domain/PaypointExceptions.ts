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
        super('There are no payment methods chosen for this paypoint');
    }
}

export class RoleProductsNotFoundError extends Error {
    constructor() {
        super('There are no role products created for this guild');
    }
}

export class RoleProductNotPrividedError extends Error {
    constructor() {
        super('The role was not provided');
    }
}

export class RoleProductPriceNotPrividedError extends Error {
    constructor() {
        super('The price for the product was not provided');
    }
}

export class InvalidRoleProductPriceError extends Error {
    constructor() {
        super('The price for the product is invalid');
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