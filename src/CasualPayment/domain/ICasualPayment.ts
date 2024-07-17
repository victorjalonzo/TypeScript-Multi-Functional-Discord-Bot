export interface ICasualPaymentMethod {
    method: "Cash App" | "Zelle" | "Paypal" | "Venmo" | "Apple Pay" | "Google Pay",
    value: string
}