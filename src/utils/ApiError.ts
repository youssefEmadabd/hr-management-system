/**
 * An Error object that can be thrown by the API.
 * @class ApiError
 * @extends {Error}
 * @property {number} status - The HTTP status code of the response.
 * @property {string} message - The error message.
 * @property {object} data - The error data.
 * @property {string} stack - The error stack.
 * 
 */
export default class ApiError extends Error {
  statusCode: number;
  data: object;
  stack: string;
  message: string;

  constructor(
    statusCode: number,
    message: string,
    data: object = {},
    stack = '',
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    if (stack) this.stack = stack;
    else Error.captureStackTrace(this, this.constructor);
  }
}
