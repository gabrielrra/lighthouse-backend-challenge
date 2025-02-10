import fs from 'fs';
import { createLogger, transports, format } from 'winston';
const { printf } = format;

const logsDir = 'logs';
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const customFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} | ${level.toUpperCase()} | ${message}`;
});

export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    customFormat
  ),
  transports: [
    new transports.File({ filename: `${logsDir}/logs.log`, maxsize: 10240 })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.timestamp(),
      customFormat
    )
  }));
}
