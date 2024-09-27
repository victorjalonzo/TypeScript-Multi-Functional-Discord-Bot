export class ThreadConversationCreationError extends Error {
    constructor() {
        super('The DM conversaction could not be created');
    }
}

export class ThreadConversationUpdateError extends Error {
    constructor() {
        super('The DM conversaction could not be updated');
    }
}

export class ThreadConversationNotFoundError extends Error {
    constructor() {
        super('The DM conversaction could not be found');
    }
}

export class ThreadConversationDeletionError extends Error {
    constructor() {
        super('The DM conversaction could not be deleted');
    }
}

export class ThreadConversationUpdatableMessageNotFoundError extends Error {
    constructor() {
        super('The updatable message could not be found');
    }
}