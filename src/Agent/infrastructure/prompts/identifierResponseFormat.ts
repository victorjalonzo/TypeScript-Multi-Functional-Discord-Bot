export const getIdentifierResponseFormat = () => {
    return `
RESPONSE FORMAT:

Respond only with a JSON object in the following format. Do not include backticks, extra quotes, or language tags like json. The response should be a clean JSON object:

{
  "isValid": boolean,   // Indicates whether the user's response is valid (true) or not (false).
  "message": string  // A brief message directed at the user to guide or remind them to provide the identifier.
  "identifier": string  // The identifier value extracted from the user's response, or an empty string if not provided.
}
`
}