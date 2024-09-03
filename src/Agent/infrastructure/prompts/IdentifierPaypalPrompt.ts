import { getIdentifierResponseFormat } from "./identifierResponseFormat.js"

export const createIdentifierPaypalPrompt = (conversation: string) => {
    return `
A user claimed to have made a payment through PayPal. We need to verify if their response is valid for the question asked. A PayPal identifier is typically a unique email address associated with the user's PayPal account, used to identify user accounts within the system.

INSTRUCTIONS:

Evaluate the following conversation and determine if the user's response contains a valid PayPal identifier. The user should only respond with a valid identifier; any other response, such as questions or expressions of confusion, will not be considered valid.

CONVERSATION: 
${conversation}

${getIdentifierResponseFormat()}
`
}