export class ThreadConversationCreationError extends Error {
    constructor() {
        super('Thread conversaction could not be created');
    }
}

export class ThreadConversationUpdateError extends Error {
    constructor() {
        super('Thread conversaction could not be updated');
    }
}

export class ThreadConversationNotFoundError extends Error {
    constructor() {
        super('Thread conversaction could not be found');
    }
}

export class ThreadConversationDeletionError extends Error {
    constructor() {
        super('Thread conversaction could not be deleted');
    }
}

export class ThreadConversationUpdatableMessageNotFoundError extends Error {
    constructor() {
        super('Updatable message could not be found');
    }
}

export class ThreadConversationClosedAlreadyError extends Error {
    constructor() {
        super('Thread conversaction is already closed');
    }
}
export class ThreadConversationCancelledAlreadyError extends Error {
    constructor() {
        super('Thread conversaction is already cancelled');
    }
}

export class ThreadConversationAlreadyWaitingApprovalError extends Error {
    constructor() {
        super('Thread conversaction is already waiting for approval');
    }
}