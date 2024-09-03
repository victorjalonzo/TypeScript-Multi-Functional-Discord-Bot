import { getIdentifierResponseFormat } from "./identifierResponseFormat.js"

export const createIdentifierBitcoinPrompt = (conversation: string) => {
    return `
A user claimed to have made a payment through Bitcoin. We need to verify if their response is valid for the question asked. A Bitcoin address is typically a unique string of alphanumeric characters, usually starting with "1," "3," or "bc1," used to identify Bitcoin wallets for transactions.

INSTRUCTIONS:

Evaluate the following conversation and determine if the user's response contains a valid Bitcoin address. The user should only respond with a valid Bitcoin address; any other response, such as questions or expressions of confusion, will not be considered valid.

CONVERSATION: 
${conversation}

${getIdentifierResponseFormat()}
`
}