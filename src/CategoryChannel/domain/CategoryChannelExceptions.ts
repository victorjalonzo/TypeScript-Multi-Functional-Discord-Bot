export class CategoryChannelCreationError extends Error {
    constructor() {
        super("The category channel could not be created");
    }
}

export class CategoryChannelNotFoundError extends Error {
    constructor() {
        super("The category channel could not be found");
    }
}

export class CategoryChannelUpdateError extends Error {
    constructor() {
        super("The category channel could not be updated");
    }
}

export class CategoryChannelDeletionError extends Error {
    constructor() {
        super("The category channel could not be deleted");
    }
}

export class CategoryChannelTransformationError extends Error {
    constructor(error: string) {
        super(`The category channel could not be transformed: ${error}`);
    }
}