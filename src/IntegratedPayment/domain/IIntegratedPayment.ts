export interface IIntegratedPayment {
    id: string
    guildId: string
    service: "Stripe" | "Paypal",
    publicKey: string
    secretKey: string
}