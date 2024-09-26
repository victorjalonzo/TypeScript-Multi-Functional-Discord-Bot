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

export class DefaultCreditsNotProvidedError extends Error {
    constructor () {
        super('The default credits were not provided.');
    }
}

export class DefaultRoleNotProvidedError extends Error {
    constructor () {
        super('The default role was not provided.');
    }
}

export class DefaultNotificationChannelNotProvidedError extends Error {
    constructor () {
        super('The default notification channel was not provided.');
    }
}

export class DefaultInvoiceChannelNotProvidedError extends Error {
    constructor () {
        super('The default invoice channel was not provided.');
    }
}

export class GuildHasNoRoles extends Error {
    constructor () {
        super('No roles available')
    }
}

export class GuildHasNoCategoryChannels extends Error {
    constructor () {
        super('No category channels available')
    }
}

export class GuildHasNoTextChannels extends Error {
    constructor () {
        super('No text channels available')
    }
}

export class GuildHasNoVoiceChannels extends Error {
    constructor () {
        super('No voice channels available')
    }
}

export class GuildHasNoMembers extends Error {
    constructor () {
        super('No members available')
    }
}
