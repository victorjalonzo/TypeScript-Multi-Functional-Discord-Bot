export const DecodeFromBase64 = (data: string): Record<string, any> => {
    return JSON.parse(Buffer.from(data, 'base64').toString())
}