import { CustomException } from "../../shared/domain/CustomException.js";

export class ChannelRecordCanNotBeCreated extends CustomException {
    constructor(channel: Record<string, any>, dueTo?: string) {
        super({
            message:`The channel record ${channel.name} (${channel.id}) from the guild ${channel.guildId} could not be created`,
            dueTo: dueTo
        });
    }
}

export class ChannelRecordCanNotBeModified extends CustomException {
    constructor(channel: Record<string, any>, dueTo?: string) {
        super({
            message:`The channel record ${channel.name} (${channel.id}) from the guild ${channel.guildId} could not be modified`,
            dueTo: dueTo
        });
    }
}

export class ChannelRecordCanNotBeDeleted extends CustomException {
    constructor(channel: Record<string, any>, dueTo?: string) {
        super({
            message:`The channel record ${channel.name} (${channel.id}) from the guild ${channel.guildId} could not be deleted`,
            dueTo: dueTo
        });
    }
}

export class ChannelTypeNotSupported extends CustomException {
    constructor(channel: Record<string, any>, dueTo?: string) {
        super({
            message:`The channel ${channel.name} (${channel.id}) from the guild ${channel.guildId} it is not supported`,
            dueTo: dueTo
        });
    }
}