export const executeWithAttemps = async (fn: () => Promise<any>, maxAttempts: number) => {
    let attempts = 0
    let result
    let error

    while(attempts < maxAttempts) {
        try {
            result = await fn()
            break
        } catch (e) {
            attempts += 1
            error = String(e)
        }
    }

    if (!result) throw new Error(error)
    return result
}