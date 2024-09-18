export class CreditRewardCreationError extends Error {
    constructor() {
        super('Failed to create credit reward');
    }
}

export class CreditRewardUpdateError extends Error {
    constructor() {
        super('Failed to update credit reward');
    }
}

export class CreditRewardNotFoundError extends Error {
    constructor() {
        super('Credit reward not found');
    }
}


export class CreditRewardAlreadyExistsError extends Error {
    constructor() {
        super('Credit reward already exists');
    }
}


export class CreditRewardDeleteError extends Error {
    constructor() {
        super('Failed to delete credit reward');
    }
}

export class CreditsNotProvidedError extends Error {
    constructor() {
        super('Credits were not provided');
    }
}

export class InvitesRequiredNotProvidedError extends Error {
    constructor() {
        super('Invites required were not provided');
    }
}

export class CreditRewardIdNotProvidedError extends Error {
    constructor() {
        super('Credit reward id was not provided');
    }
}