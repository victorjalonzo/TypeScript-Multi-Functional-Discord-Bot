export class TextChannelCreationError extends Error {
    constructor() {
        super('The text channel could not be created');
    }
}

export class TextChannelNotFoundError extends Error {
    constructor() {
        super('The text channel could not be found');
    }
}

export class TextChannelUpdateError extends Error {
    constructor() {
        super('The text channel could not be updated');
    }
}

export class TextChannelDeletionError extends Error {
    constructor() {
        super('The text channel could not be deleted');
    }
}