export class RewardRoleCreationFailed extends Error {
    constructor() {
        super("The role as reward could not be created");
    }
}

export class RewardRoleNotFound extends Error {
    constructor() {
        super("The role as reward could not be found");
    }
}

export class RewardRolesNotFound extends Error {
    constructor() {
        super("There are no roles as rewards created");
    }
}

export class RewardRoleDeletionFailed extends Error {
    constructor() {
        super("The role as reward could not be deleted");
    }
}

export class InviteCountMismatchRewardsError extends Error {
    constructor() {
        super("The invite count does not match any reward");
    }
}