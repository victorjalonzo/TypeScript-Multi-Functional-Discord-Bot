export class CustomException extends Error {
    constructor({message, dueTo}: {message: string, dueTo?: string}) {
        const outputMessage = message + (dueTo ? ` due to: ${dueTo}` : '');
        super(outputMessage);
    }
}