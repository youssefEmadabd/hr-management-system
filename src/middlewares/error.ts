import httpStatus from 'http-status';
import { NextFunction, Response } from 'express';

import { RequestInterface } from '../types';
import ApiError from '../utils/ApiError';

/**
 * @description ErrorHandler function to send thrown exceptions to the client
 * @param {RequestInterface} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {void}
 */
const errorHandler = (
    err,
    req: RequestInterface,
    res: Response,
    next: NextFunction,
) => {
    let error = err;
    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || httpStatus[statusCode];
        error = new ApiError(statusCode, message, {}, err.stack);
    }
    let { statusCode, message } = error;
    res.locals.errorMessage = err.message;
    const response = {
        code: statusCode,
        message,
    };
    res.status(statusCode).send(response);
};

export default errorHandler;
