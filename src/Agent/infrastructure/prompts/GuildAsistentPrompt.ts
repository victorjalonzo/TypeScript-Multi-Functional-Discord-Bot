import { IRoleReward } from "../../../RoleReward/domain/IRoleReward.js";
import { IPaypoint } from "../../../Paypoint/domain/IPaypoint.js";
import { IRoleProduct } from "../../../RoleProduct/domain/IRoleProduct.js";
import { ICreditProduct } from "../../../CreditProduct/domain/ICreditProduct.js";
import { ICreditReward } from "../../../CreditReward/domain/ICreditReward.js";

interface IOptions {
    paypoint: IPaypoint,
    creditProducts: ICreditProduct[],
    creditRewards: ICreditReward[],
    roleProducts: IRoleProduct[],
    roleRewards: IRoleReward[],
    conversaction: string[]
}

export const createGuildAsistentPrompt = (options: IOptions) => {
    const creditProductsData = options.creditProducts.length == 0
    ? `There are no credit products in this guild.`
    : `There are ${options.creditProducts.length} credit products available:\n` + 
      options.creditProducts.map(product => 
        `Product: ${product.name}\n
        Price: ${product.price} USD\n
        Description: ${product.description}`
    ).join("\n")

    const creditRewardsData = options.creditRewards.length == 0
    ? `There are no credit rewards in this guild.`
    : `There are ${options.creditRewards.length} credit rewards.\n` + 
      options.creditRewards.map(reward => 
        `*<@&${reward.name}>: ${reward.invitesRequired} invites needed.`)
        .join("\n")
      
    const roleProductsData = options.roleProducts.length == 0
    ? `There are no role products in this guild.`
    : `There are ${options.roleProducts.length} role products available:\n` + 
      options.roleProducts.map(product => 
        `Product: <@&${product.role.id}>\n
        Price: ${product.price} USD\n
        Description: ${product.description}`
    ).join("\n")

    const roleRewardsData = options.roleRewards.length == 0
    ? `There are no role rewards in this guild.`
    : `There are ${options.roleRewards.length} role rewards.\n` + 
      options.roleRewards.map(reward => 
        `*<@&${reward.role.id}>: ${reward.invitesRequired} invites needed.`)
        .join("\n")

    const paypointData = (!options.paypoint || !options.paypoint.channelId)
    ? "There is no payment point."
    : `There is a PayPoint in the channel <#${options.paypoint.channelId}>.` 

    const conversationData = options.conversaction.length == 0
    ? `There are no current conversation.`
    : options.conversaction.join("\n")


    return `
*** PERSONALITY ***
You are an AI in charge of managing a Discord server (Guild).
Your duty is to respond to user concerns with precise information based on the DATABASE.
Your answers are concise, delivering key details efficiently.

*** CONCEPTS ***
PAYPOINT: An interactive component in a channel where users can purchase credits or roles as products.

ROLE PRODUCTS: Discord roles available for purchase through the paypoint. These roles can grant access to exclusive channels and special permissions within the server.

ROLE REWARDS: Roles awarded for free when members reach a specific number of invites. These roles may unlock certain server features.

CREDIT PRODUCTS: Credits that can be bought through the paypoint. Credits allow members to unlock individual channels by purchasing them with specific credit amounts.

CREDIT REWARDS: Credits that are given for free when members reach a particular number of invites.

**** DATABASE INFORMATION ****

ROLE REWARDS:
${roleRewardsData}

ROLE PRODUCTS:
${roleProductsData}

CREDIT REWARDS:
${creditRewardsData}

CREDIT PRODUCTS:
${creditProductsData}

PAYMENT POINT:
${paypointData}

RESPONSE FORMAT:

Respond only with a JSON object in the following format. Do not include backticks, extra quotes, or language tags like json. The response should be a clean JSON object:

{
  "message": string  // A brief message directed at the user to guide them or just reply to their question.
}

***CURRENT CONVERSACTION***

${conversationData}
`
}