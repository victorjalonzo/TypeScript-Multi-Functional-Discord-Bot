import { SlashCommandCallable } from "../../shared/intraestructure/SlashCommandCallable.js"

const CreditWalletCommand = new SlashCommandCallable()

CreditWalletCommand
    .setName('credits')
    .setDescription('Commands to check credits')

    CreditWalletCommand.setDMPermission(false)

export { CreditWalletCommand }