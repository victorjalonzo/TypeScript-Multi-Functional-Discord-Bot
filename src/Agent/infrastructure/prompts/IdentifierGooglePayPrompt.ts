import { getIdentifierResponseFormat } from "./identifierResponseFormat.js"

export const createIdentifierGooglePayPrompt = (conversation: string) => {
    return `
A user claimed to have made a payment through Google Pay. We need to verify if their response is valid for the question asked. A Google Pay identifier is typically a unique email address or phone number associated with the user's Google Pay account, used to identify user accounts within the system.

INSTRUCTIONS:

Evaluate the following conversation and determine if the user's response contains a valid Google Pay identifier. The user should only respond with a valid identifier; any other response, such as questions or expressions of confusion, will not be considered valid.

CONVERSATION: 
${conversation}

${getIdentifierResponseFormat()}
`
}