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