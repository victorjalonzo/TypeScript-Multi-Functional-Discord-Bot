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
