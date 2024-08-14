export class MemberAlreadyExistsError extends Error {
    constructor() {
        super('The member already exists');
    }
}

export class MemberCreationError extends Error {
    constructor() {
        super('The member can not be created');
    }
}

export class MemberNotFoundError extends Error {
    constructor() {
        super('The member record could not be found');
    }
}

export class MemberUpdateError extends Error {
    constructor() {
        super('The member record could not be updated');
    }
}

export class MemberDeletionError extends Error {
    constructor() {
        super('The member record could not be deleted');
    }
}