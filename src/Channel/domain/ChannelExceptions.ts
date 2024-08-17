export class ChannelRecordCreationError extends Error {
    constructor (){
        super('The channel record could not be created');
    }
}

export class ChannelRecordNotFoundError extends Error {
    constructor (){
        super('The channel record could not be found');
    }
}

export class ChannelRecordUpdateError extends Error {
    constructor (){
        super('The channel record could not be updated');
    }
}

export class ChannelRecordDeleteError extends Error {
    constructor (){
        super('The channel record could not be deleted');
    }
}

export class ChannelTypeNotSupported extends Error {
    constructor (){
        super('The channel type is not supported');
    }
}