export class RoleRewardCreationFailed extends Error {
    constructor() {
        super("The role as reward could not be created");
    }
}

export class RoleRewardNotFound extends Error {
    constructor() {
        super("The role as reward could not be found");
    }
}

export class RolesRewardNotFound extends Error {
    constructor() {
        super("There are no roles as rewards created");
    }
}

export class RoleRewardDeletionFailed extends Error {
    constructor() {
        super("The role as reward could not be deleted");
    }
}

export class InviteCountMismatchRewardsError extends Error {
    constructor() {
        super("The invite count does not match any reward");
    }
}