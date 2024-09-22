export class InvitePointCreationError extends Error {
    constructor() {
        super('The invite point could not be created');
    }
}

export class InvitePointNotFoundError extends Error {
    constructor() {
        super('The invite point could not be found');
    }
}

export class InvitePointUpdateError extends Error {
    constructor() {
        super('The invite point could not be updated');
    }
}

export class InvitePointDeletionError extends Error {
    constructor() {
        super('The invite point could not be deleted');
    }
}