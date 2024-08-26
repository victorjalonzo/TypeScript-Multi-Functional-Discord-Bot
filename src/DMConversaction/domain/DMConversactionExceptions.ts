export class DMConversactionCreationError extends Error {
    constructor() {
        super('The DM conversaction could not be created');
    }
}

export class DMConversactionUpdateError extends Error {
    constructor() {
        super('The DM conversaction could not be updated');
    }
}

export class DMConversactionNotFoundError extends Error {
    constructor() {
        super('The DM conversaction could not be found');
    }
}

export class DMConversactionDeletionError extends Error {
    constructor() {
        super('The DM conversaction could not be deleted');
    }
}
