import winston from "winston";

export const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `\n${JSON.stringify({
                level,
                message,
                timestamp
            }, null, 2)}\n`;
        })
    ),
    transports: [
        new winston.transports.Console({})
    ]
});