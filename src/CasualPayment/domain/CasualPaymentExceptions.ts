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

export class GuildNotFoundError extends Error {
    constructor() {
        super('The guild was not found');
    }
}

export class UnexpectedError extends Error {
    constructor() {
        super('Something went wrong while executing the command');
    }
}