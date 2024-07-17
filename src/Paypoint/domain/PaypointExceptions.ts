import { CustomException } from "../../shared/domain/CustomException.js";

export class PaypointCanNotBeCreated extends CustomException {
    constructor(dueTo?: string) {
        super({
            message:`This paypoint cannot be created`,
            dueTo: dueTo
        });
    }
}

export class PaypointCannotBeRetrieved extends CustomException {
    constructor(dueTo?: string) {
        super({
            message:`The paypoint cannot be retrieved`,
            dueTo: dueTo
        });
    }
}

export class PaypointCanNotBeDeleted extends CustomException {
    constructor(dueTo?: string) {
        super({
            message:`This paypoint cannot be deleted`,
            dueTo: dueTo
        });
    }
}