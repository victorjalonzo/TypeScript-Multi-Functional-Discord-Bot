interface IntegrationPaymentMethod {
    method: "Stripe" | "Paypal",
    publicKey: string
    secretKey: string
}

export interface CasualPaymentMethod {
    method: "Cash App" | "Zelle" | "Paypal" | "Venmo" | "Apple Pay" | "Google Pay",
    value: string
}

export interface Payment {
    id: string
    guildId: string
    integrationPayment: IntegrationPaymentMethod[]
    casualPayment: CasualPaymentMethod[]
}