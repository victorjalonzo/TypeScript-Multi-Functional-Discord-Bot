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