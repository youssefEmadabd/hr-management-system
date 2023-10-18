import { Response as IRes } from 'express';
import httpStatus from 'http-status';
import { Document } from 'mongoose';

import Service from '../services/Service';
import ApiError from '../utils/ApiError';
import { RequestInterface as IReq } from '../types';
import autoBind from 'auto-bind';

class Controller<IModel extends Document, MyService extends Service<IModel>> {
    service: MyService;
    constructor(service: MyService) {
        this.service = service;
        autoBind(this);
    }

    async create(req: IReq, res: IRes): Promise<void> {
        try {
            const myService = this.service;
            const result = await myService.create({
                ...req.body,
            });
            res.status(httpStatus.CREATED).send(result);
        } catch (err) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.message);
        }
    }

    async get(req: IReq, res: IRes): Promise<void> {
        try {
            const myService = this.service;
            const id = req.params.id;
            const filter: object = { _id: id };
            const result = await myService.get(filter);
            if (!result) throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
            res.status(httpStatus.ACCEPTED).send({ ...result, found: true });
        } catch (err) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.message);
        }
    }

    async update(req: IReq, res: IRes): Promise<void> {
        try {
            const myService = this.service;
            const id = req.user.sub;
            const filter: object = { _id: id };
            const result = await myService.update(filter, req.body);
            res.status(httpStatus.OK).send(result);
        } catch (err) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.message);
        }
    }

    async delete(req: IReq, res: IRes): Promise<void> {
        try {
            const myService = this.service;
            const id = req.user.sub;
            const filter: object = { _id: id };
            const result = await myService.delete(filter);
            if (!result) throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
            res.status(httpStatus.NO_CONTENT).send(result);
        } catch (err) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.message);
        }
    }
}

export default Controller;
