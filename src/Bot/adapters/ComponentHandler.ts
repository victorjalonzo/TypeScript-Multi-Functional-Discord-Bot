import { ButtonInteraction, ModalSubmitInteraction, StringSelectMenuInteraction } from "discord.js"
import { ComponentActions } from "../../shared/intraestructure/Container.js"
import { logger } from "../../shared/utils/logger.js"
import { ComponentActionDataTransformer } from "../../shared/domain/ComponentActionDataTransformer.js"
import { M } from "vitest/dist/reporters-yx5ZTtEV.js"

export class ComponentHandler {
    actions: Record<string, any>[]

    constructor () {
        this.actions = ComponentActions
    }

    async handle(interaction: ButtonInteraction | StringSelectMenuInteraction | ModalSubmitInteraction) {
        const componentActionData = ComponentActionDataTransformer.parse(interaction.customId)

        for (const action of this.actions) {
            if (componentActionData.id == action.id) {
                return await action.execute(interaction, componentActionData)
            }
        }

        return logger.warn(`Unknow component interaction type received... ${interaction.customId}`)
    }
}