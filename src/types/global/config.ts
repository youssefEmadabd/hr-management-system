import { ServerResponse } from 'http';

import winston from 'winston';

export interface LoggerInterface extends winston.Logger {
  successHandler?: CallableFunction;
  errorHandler?: CallableFunction;
}

export interface PassportPayload {
  type: string;
  sub: string;
}

export interface LoggerResponse extends ServerResponse {
  locals: { errorMessage: string };
}
