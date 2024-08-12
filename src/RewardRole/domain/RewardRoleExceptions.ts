export class RewardRoleCreationFailed extends Error {
    constructor() {
        super("The reward role could not be created");
    }
}

export class RewardRoleNotFound extends Error {
    constructor() {
        super("The reward role could not be found");
    }
}

export class RewardRoleDeletionFailed extends Error {
    constructor() {
        super("The reward role could not be deleted");
    }
}