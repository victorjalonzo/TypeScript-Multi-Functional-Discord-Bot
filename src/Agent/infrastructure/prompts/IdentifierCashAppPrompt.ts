import { getIdentifierResponseFormat } from "./identifierResponseFormat.js"

export const createIdentifierCashAppPrompt = (conversation: string) => {
    return `
A user claimed to have made a payment through Cash App. We need to verify if their response is valid for the question asked. A tagname is a unique identifier in Cash App, usually starting with a dollar sign ($) followed by letters or numbers, and is used to identify user accounts.

INSTRUCTIONS:

Evaluate the following conversation and determine if the user's response contains a valid Cash App tagname. The user should only respond with a valid tagname; any other response, such as questions or expressions of confusion, will not be considered valid.

CONVERSATION:
${conversation}

${getIdentifierResponseFormat()}
`
}