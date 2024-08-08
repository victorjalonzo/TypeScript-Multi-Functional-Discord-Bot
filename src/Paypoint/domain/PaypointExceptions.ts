export class CreditPackageRequiredError extends Error {
    constructor() {
        super('At least one credit package is required');
    }
}