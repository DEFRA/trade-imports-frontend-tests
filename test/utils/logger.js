import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
})

if (!globalThis.testLogger) {
  globalThis.testLogger = logger
}

export default logger
