export class CreditWalletCreationError extends Error {
    constructor () {
        super("Failed to create credit wallet")
    }
}

export class CreditWalletNotFoundError extends Error {
    constructor () {
        super("Credit wallet not found")
    }
}

export class CreditWalletUpdateError extends Error {
    constructor () {
        super("Failed to update credit wallet")
    }
}

export class CreditWalletDeletionError extends Error {
    constructor () {
        super("Failed to delete credit wallet")
    }
}

export class CreditWalletInsufficientCreditsError extends Error {
    availableCredits: number
    requiredCredits: number

    constructor ({availableCredits, requiredCredits}: {availableCredits: number, requiredCredits: number}) {
        super("Insufficient credits")
        this.availableCredits = availableCredits
        this.requiredCredits = requiredCredits
    }
}