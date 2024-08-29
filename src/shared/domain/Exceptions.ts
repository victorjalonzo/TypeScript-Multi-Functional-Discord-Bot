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

export class UnknownButtonInteractionError extends Error {
    constructor() {
        super('The button interaction was not found');
    }
}

export class UnknownInteractionError extends Error {
    constructor() {
        super('The interaction was not found');
    }
}

export class UnknownStringSelectMenuInteractionError extends Error {
    constructor() {
        super('The string select menu interaction was not found');
    }
}