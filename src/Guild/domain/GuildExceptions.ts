export class GuildRecordCreationError extends Error {
    constructor () {
        super('The guild record could not be created.');
    }
}

export class GuildRecordNotFoundError extends Error {
    constructor () {
        super('The guild record could not be found.');
    }
}

export class GuildRecordUpdateError extends Error {
    constructor () {
        super('The guild record could not be updated.');
    }
}

export class GuildRecordDeletionError extends Error {
    constructor () {
        super('The guild record could not be deleted.');
    }
}

export class GuildRecordTransformationError extends Error {
    constructor () {
        super('The guild record could not be transformed.');
    }
}