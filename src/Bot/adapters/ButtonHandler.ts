import { ButtonInteraction } from "discord.js"
import { ButtonActions } from "../../shared/intraestructure/Container.js"
import { logger } from "../../shared/utils/logger.js"

export class ButtonHandler {
    actions: Record<string, any>[]

    constructor () {
        this.actions = ButtonActions
    }

    async handle(interaction: ButtonInteraction) {
        for (const action of this.actions) {
            if (interaction.customId.startsWith(action.customId)) {
                return await action.execute(interaction)
            }
        }

        return logger.warn(`Unknow button interaction received... ${interaction.customId}`)
    }
}