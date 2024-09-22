export class InviteCodeCreationError extends Error {
    constructor () {
        super('The invite code could not be created');
    }
}

export class InviteCodeUpdateError extends Error {
    constructor () {
        super('The invite code could not be updated');
    }
}

export class InviteCodeDeletionError extends Error {
    constructor () {
        super('The invite code could not be deleted');
    }
}

export class InviteCodeNotFoundError extends Error {
    constructor () {
        super('The invite code could not be found');
    }
}