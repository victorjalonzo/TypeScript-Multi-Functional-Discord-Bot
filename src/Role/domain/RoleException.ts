export class RoleCreationError extends Error {
    constructor() {
        super('The role record could not be created');
    }
}

export class RoleNotFoundError extends Error {
    constructor() {
        super('The role record could not be found');
    }
}

export class RoleUpdateError extends Error {
    constructor() {
        super('The role record could not be updated');
    }
}

export class RoleDeletionError extends Error {
    constructor() {
        super('The role record could not be deleted');
    }
}