export class RoleRecordCreationError extends Error {
    constructor() {
        super('The role record could not be created');
    }
}

export class RoleRecordUpdateError extends Error {
    constructor() {
        super('The role record could not be updated');
    }
}

export class RoleRecordDeletionError extends Error {
    constructor() {
        super('The role record could not be deleted');
    }
}