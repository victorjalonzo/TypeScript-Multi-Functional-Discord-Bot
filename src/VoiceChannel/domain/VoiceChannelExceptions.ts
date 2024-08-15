export class VoiceChannelCreationError extends Error {
    constructor() {
        super('The voice channel could not be created');
    }
}

export class VoiceChannelNotFoundError extends Error {
    constructor() {
        super('The voice channel could not be found');
    }
}

export class VoiceChannelUpdateError extends Error {
    constructor() {
        super('The voice channel could not be updated');
    }
}

export class VoiceChannelDeletionError extends Error {
    constructor() {
        super('The voice channel could not be deleted');
    }
}

export class VoiceChannelTransformationError extends Error {
    constructor(error: string) {
        super(`The voice channel could not be transformed: ${error}`);
    }
}