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
function RefreshTokenAuth(req: RequestInterface, res: Response, next: NextFunction) {
    const refreshHeader:string = req.headers['x-refresh-token'];
    if (!refreshHeader)
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Token not found');
    try {
        const decoded = jwt.verify(refreshHeader, config.jwt.refresh_secret);
        req.user = decoded;
        next();
    } catch (ex) {
        throw new ApiError(httpStatus.UNAUTHORIZED, `Failed to decode: ${ex.message}`);
    }
}

export default RefreshTokenAuth;
