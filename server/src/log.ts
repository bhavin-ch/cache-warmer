import winston from 'winston'

let logger: winston.Logger

export const getLogger = (): winston.Logger => {
  if (!logger) {
    logger = winston.createLogger({
      level: 'info',
      format: winston.format.cli(),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.printf(
              ({ timestamp, level, message }) =>
                `[${level}] ${timestamp} ${message}`
            )
          ),
        }),
      ],
    })
  }

  return logger
}
