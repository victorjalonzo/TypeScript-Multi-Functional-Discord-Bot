import { getIdentifierResponseFormat } from "./identifierResponseFormat.js"

export const createIdentifierEthereumPrompt = (conversation: string) => {
    return `
A user claimed to have made a payment through Ethereum. We need to verify if their response is valid for the question asked. An Ethereum address is typically a unique string of alphanumeric characters, starting with "0x" followed by 40 hexadecimal characters (digits and letters from a to f), used to identify Ethereum wallets for transactions.

INSTRUCTIONS:

Evaluate the following conversation and determine if the user's response contains a valid Ethereum address. The user should only respond with a valid Ethereum address; any other response, such as questions or expressions of confusion, will not be considered valid.

CONVERSATION: 
${conversation}

${getIdentifierResponseFormat()}
`
}