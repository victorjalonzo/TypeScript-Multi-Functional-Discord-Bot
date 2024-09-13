export class BackupCreationError extends Error {
    constructor() {
        super('The backup could not be created');
    }
}

export class BackupNotFoundError extends Error {
    constructor() {
        super('The backup could not be found');
    }
}

export class BackupAlreadyExistsError extends Error {
    constructor() {
        super('The backup already exists');
    }
}

export class BackupUpdateError extends Error {
    constructor() {
        super('The backup could not be updated');
    }
}

export class BackupDeletionError extends Error {
    constructor() {
        super('The backup could not be deleted');
    }
}

export class BackupNameRequiredError extends Error {
    constructor() {
        super('The backup name is required');
    }
}