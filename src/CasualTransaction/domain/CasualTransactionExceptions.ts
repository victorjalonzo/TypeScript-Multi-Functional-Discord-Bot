export class CasualTransactionCreationError extends Error {
    constructor() {
        super(`The transaction could not be created`);
    }
}

export class CasualTransactionUpdateError extends Error {
    constructor() {
        super(`The transaction could not be updated`);
    }
}

export class CasualTransactionNotFoundError extends Error {
    constructor() {
        super(`The transaction could not be found`);
    }
}

export class CasualTransactionDeletionError extends Error {
    constructor() {
        super(`The transaction could not be deleted`);
    }
}

