import { SlashCommandCallable } from "../../shared/intraestructure/SlashCommandCallable.js"
import { CasualPaymentMethodType } from "../domain/CasualPaymentMethodType.js";

const CasualPaymentCommand = new SlashCommandCallable()

const choices = [
    {name: 'Cash App', value: CasualPaymentMethodType.CashApp},
    {name: 'Zelle', value: CasualPaymentMethodType.Zelle},
    {name: 'PayPal', value: CasualPaymentMethodType.Paypal},
    {name: 'Venmo', value: CasualPaymentMethodType.Venmo},
    {name: 'Apple Pay', value: CasualPaymentMethodType.ApplePay},
    {name: 'Google Pay', value: CasualPaymentMethodType.GooglePay},
    {name: 'Bitcoin', value: CasualPaymentMethodType.Bitcoin},
    {name: 'Ethereum', value: CasualPaymentMethodType.Ethereum},
]

CasualPaymentCommand
    .setName('payment-casual')
    .setDescription('Command for Casual Payments management')

    .addSubcommand(subcommand => 
        subcommand
            .setName('add')
            .setDescription('Add a casual payment')
            .addStringOption(option => option
                .setName('name')
                .setDescription('The name of the payment')
                .setRequired(true)
                .addChoices(...choices)
            )
            .addStringOption(option => option
                .setName('value')
                .setDescription('The value of the payment')
                .setRequired(true)
            )
        )
        
    .addSubcommand(subcommand => 
        subcommand
            .setName('remove')
            .setDescription('Remove a casual payment')
            .addStringOption(option => option
                .setName('name')
                .setDescription('The name of the payment')
                .setRequired(true)
                .addChoices(...choices)
            )
        )

        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('List all casual payments')
        );

CasualPaymentCommand.setDefaultMemberPermissions(8)
CasualPaymentCommand.setDMPermission(false)

export  { CasualPaymentCommand }