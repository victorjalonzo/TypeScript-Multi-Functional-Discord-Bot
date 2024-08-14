export class UserJoinedWithoutInviterError extends Error {
    constructor() {
        super('The user joined without an inviter');
    }
}
export class DuplicateUserInviteError extends Error {
    constructor() {
        super('The user was invited before');
    }
}

export class InviterNotFoundError extends Error {
    constructor() {
        super('The inviter was not found');
    }
}