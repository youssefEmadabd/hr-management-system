import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';

import { RequestInterface } from '../types';
import { config } from '../config/config';
import ApiError from '../utils/ApiError';

/**
 * @description Middleware to verify the JWT token
 * @param {RequestInterface} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {void}
 * @throws {ApiError}
 */
function Auth(req: RequestInterface, res: Response, next: NextFunction) {
    const bearerHeader = req.headers.authorization;
    if (!bearerHeader)
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Token not found');
    let token = '';
    if (bearerHeader.startsWith('Bearer ')) {
        token = bearerHeader.substring(7, bearerHeader.length);
    } else {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Jwt malformed');
    }
    try {
        const decoded = jwt.verify(token, config.jwt.secret);
        req.user = decoded;
        next();
    } catch (ex) {
        throw new ApiError(httpStatus.UNAUTHORIZED, `Failed to decode: ${ex.message}`);
    }
}

export default Auth;
