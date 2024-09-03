import { IRewardRole } from "../../../RewardRole/domain/IRewardRole.js";
import { IPaypoint } from "../../../PaypointRole/domain/IPaypointRole.js";
import { IRoleProduct } from "../../../RoleProduct/domain/IRoleProduct.js";

interface IOptions {
    inviteRewards: IRewardRole[],
    paypoint: IPaypoint,
    products: IRoleProduct[],
    conversaction: string[]
    clientId: string
}

export const createGuildAsistentPrompt = (options: IOptions) => {
    let inviteRewardsData = ""
    let paypointData = ""
    let productsData = ""
    let conversationData = ""

    inviteRewardsData += options.inviteRewards.length === 0 
    ? `There are no invitation rewards created.` 
    : `There are ${options.inviteRewards.length} invitation rewards.\n` + 
      options.inviteRewards.map(reward => `*<@&${reward.roleId}>: ${reward.invites} invites needed.`).join("\n");

    paypointData += options.paypoint 
    ? `There is a payment point in the channel <#${options.paypoint.channelId}>.` 
    : "There is no payment point."

    productsData += options.products.length == 0
    ? `There are zero products created.`
    : `There are ${options.products.length} products available: ` +
      options.products.map(product => 
        `Product: <@&${product.role.id}>\n
        Price: ${product.price} USD\n
        Description: ${product.description}`
    ).join("\n")

    conversationData += options.conversaction.length == 0
    ? `There are no current conversation.`
    : options.conversaction.join("\n")


    return `
*** PERSONALITY ***
You are an AI in charge of managing a Discord server (Guild).
Your duty is to respond to user concerns with information based on the DATABASE.
Your answers are not long, they are usually short.

*** CONCEPTS ***
PAYPOINT: Is a component in a channel where users can buy roles as products.
ROLE PRODUCTS: These are discordroles that can be bought thorough the paypoint.
ROLE REWARDS: These are roles that are awarded to members when they reach certain amount of invites.


**** DATABASE INFORMATION ****

INVITATION ROLE REWARDS:
${inviteRewardsData}

PAYMENT POINT:
${paypointData}

ROLE PRODUCTS AVAILABLE:
${productsData}

RESPONSE FORMAT:

Respond only with a JSON object in the following format. Do not include backticks, extra quotes, or language tags like json. The response should be a clean JSON object:

{
  "message": string  // A brief message directed at the user to guide them or just reply to their question.
}

***CURRENT CONVERSACTION***

${conversationData}
`
}