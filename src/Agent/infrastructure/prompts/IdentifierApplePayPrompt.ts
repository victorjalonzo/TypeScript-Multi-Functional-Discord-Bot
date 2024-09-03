import { getIdentifierResponseFormat } from "./identifierResponseFormat.js"

export const createIdentifierApplePayPrompt = (conversation: string) => {
    return `
A user claimed to have made a payment through Apple Pay. We need to verify if their response is valid for the question asked. An Apple Pay identifier is a unique value associated with the user's Apple account, usually an email address or phone number, used to identify user accounts within the system.

INSTRUCTIONS:

Evaluate the following conversation and determine if the user's response contains a valid Apple Pay identifier. The user should only respond with a valid identifier; any other response, such as questions or expressions of confusion, will not be considered valid.

CONVERSATION: 
${conversation}

${getIdentifierResponseFormat()}
`
}