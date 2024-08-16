export class CachedGuildNotFoundError extends Error {
    constructor() {
        super('The cached guild could not be found');
    }
}