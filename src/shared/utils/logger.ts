import { Logger, format, transports, createLogger } from "winston";

export const logger = createLogger({
    level: 'info',
    format: format.simple(),
    transports: [
        new transports.Console()
    ]
})