export class CreditChannelLockerCreationError extends Error {
    constructor() {
        super('The credit channel locker could not be created');
    }
}

export class CreditChannelLockerNotFoundError extends Error {
    constructor() {
        super('The credit channel locker was not found');
    }
}

export class CreditChannelLockerDeletionError extends Error {
    constructor() {
        super('The credit channel locker could not be deleted');
    }
}

export class SourceChannelNotFoundError extends Error {
    constructor() {
        super('The source channel was not found');
    }
}

export class LockerChannelNotFoundError extends Error {
    constructor() {
        super('The locker channel was not found');
    }
}
