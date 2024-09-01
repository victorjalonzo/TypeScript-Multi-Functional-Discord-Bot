export const EncodeToBase64 = (data: Record<string, any>): string => {
    return Buffer.from(JSON.stringify(data)).toString('base64')
}