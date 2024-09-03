import { getIdentifierResponseFormat } from "./identifierResponseFormat.js"

export const createIdentifierVenmoPrompt = (conversation: string) => {
    return `
A user claimed to have made a payment through Venmo. We need to verify if their response is valid for the question asked. A Venmo username is typically a unique identifier associated with the user's Venmo account, usually starting with an "@" symbol followed by letters, numbers, or underscores, used to identify user accounts within the system.

INSTRUCTIONS:

Evaluate the following conversation and determine if the user's response contains a valid Venmo username. The user should only respond with a valid username; any other response, such as questions or expressions of confusion, will not be considered valid.

CONVERSATION:
${conversation}

${getIdentifierResponseFormat()}
`
}