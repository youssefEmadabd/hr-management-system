import winston from 'winston';
import morgan, { StreamOptions } from 'morgan';

import { LoggerResponse, LoggerInterface } from '../types';

import { config } from './config';

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) Object.assign(info, { message: info.stack });
  return info;
});

const logger: LoggerInterface = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    enumerateErrorFormat(),
    config.env === 'development'
      ? winston.format.colorize()
      : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.printf(({ level, message }) => `${level}: ${message}`),
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      stderrLevels: ['error'],
    }),
  ],
});

morgan.token(
  'message',
  (req: any, res: LoggerResponse): string => res.locals.errorMessage || '',
);

const getIpFormat = () =>
  config.env === 'production' ? ':remote-addr - ' : '';
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

const successStream: StreamOptions = {
  write: (message) => logger.http(message.trim()),
};

const errorStream: StreamOptions = {
  write: (message) => logger.error(message.trim()),
};

export const successLogHandler = morgan(successResponseFormat, {
  skip: (req, res) => res.statusCode >= 400,
  stream: successStream,
});

export const errorLogHandler = morgan(errorResponseFormat, {
  skip: (req, res) => res.statusCode < 400,
  stream: errorStream,
});

export default logger;
