import { CustomException } from "../../shared/domain/CustomException.js";

export class GuildTransformationError extends CustomException {
    constructor(guild: Record<string, any>, dueTo?: string) {
        super({
            message:`The object received as guild ${guild.name} (${guild.id}) could not be transformed into a guild record.`,
            dueTo: dueTo
        });
    }
}

export class CreateGuildRecordError extends CustomException {
    constructor(guild: Record<string, any>, dueTo?: string) {
        super({
            message:`The guild record ${guild.name} (${guild.id}) could not be created.`,
            dueTo: dueTo
        });
    }
}

export class UpdateGuildRecordError extends CustomException {
    constructor(guild: Record<string, any>, dueTo?: string) {
        super({
            message:`The guild record ${guild.name} (${guild.id}) could not be updated.`,
            dueTo: dueTo
        });
    }
}

export class DeleteGuildRecordError extends CustomException {
    constructor(guild: Record<string, any>, dueTo?: string) {
        super({
            message:`The guild record ${guild.name} (${guild.id}) could not be deleted.`,
            dueTo: dueTo
        });
    }
}

export class GuildRecordNotFound extends CustomException {
    constructor(guild: Record<string, any>, dueTo?: string) {
        super({
            message:`The guild record ${guild.name} (${guild.id}) could not be found.`,
            dueTo: dueTo
        });
    }
}