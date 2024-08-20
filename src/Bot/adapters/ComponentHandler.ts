import { ButtonInteraction, StringSelectMenuInteraction } from "discord.js"
import { ComponentActions } from "../../shared/intraestructure/Container.js"
import { logger } from "../../shared/utils/logger.js"

export class ComponentHandler {
    actions: Record<string, any>[]

    constructor () {
        this.actions = ComponentActions
    }

    async handle(interaction: ButtonInteraction | StringSelectMenuInteraction) {
        for (const action of this.actions) {
            if (interaction.customId.startsWith(action.customId)) {
                return await action.execute(interaction)
            }
        }

        return logger.warn(`Unknow button interaction received... ${interaction.customId}`)
    }
}