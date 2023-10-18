import { Request, Response } from "express"
import { config } from '../config/config'
import { IEmployee, RequestInterface } from "../types";
import { Employee } from "../models";
import { EmployeeService, employeeService } from "../services";
import Controller from "./Controller";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { EmployeeType } from "../types";

class EmployeeController extends Controller<IEmployee, EmployeeService>{
    async login(req: RequestInterface, res: Response) {
        const { username, password } = req.body;
        const employee: IEmployee = (await this.service.get({
            username
        }))
        
        if (!employee) throw new ApiError(httpStatus.NOT_FOUND, 'employee not found');

        const passwordMatch = await bcrypt.compare(`${password}`, employee.password);
        if (!passwordMatch) {
            throw new ApiError(httpStatus.UNAUTHORIZED, "Wrong Credentials")
        }
        if (employee.employeeType !== EmployeeType.HR) throw new ApiError(httpStatus.UNAUTHORIZED, "Sorry, you're not allowed to login to this platform")
        const token = await jwt.sign({ sub: employee._id, type: employee.employeeType, token_type: "access" }, config.jwt.secret, {
            expiresIn: '1h',
        });
        const refreshToken = await jwt.sign({ sub: employee._id, type: employee.employeeType, token_type: "refresh" }, config.jwt.secret, {
            expiresIn: '6h',
        })
        res.status(httpStatus.ACCEPTED).send({
            token,
            refreshToken,
            employee
        });
    }
    async register(req: RequestInterface, res: Response) {
        const {username, password, type} = req.body
        const checkUsername = await this.service.isUsernameUnique(username);
        if(checkUsername) throw new ApiError(httpStatus.BAD_REQUEST, "This username is already registered to the platform")
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const employee: IEmployee = await this.service.create({username, hashedPassword, type});
        if(!employee) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR,"An error occurred while creating your account")
        const token = await jwt.sign({ sub: employee._id, type: employee.employeeType, token_type: "access" }, config.jwt.secret, {
            expiresIn: '1h',
        });
        const refreshToken = await jwt.sign({ sub: employee._id, type: employee.employeeType, token_type: "refresh" }, config.jwt.secret, {
            expiresIn: '6h',
        })
        res.status(httpStatus.ACCEPTED).send({
            token,
            refreshToken,
            employee
        });
    }
    async generateAccessToken(req: RequestInterface, res:Response){
        const employee:IEmployee = await this.service.get({_id:req.user.sub});
        const token = await jwt.sign({ sub: employee._id, type: employee.employeeType, token_type: "access" }, config.jwt.secret, {
            expiresIn: '1h',
        });
        if(!token) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR,"An unknown error has occurred");
        res.status(httpStatus.ACCEPTED).send({token})
    }
    async getAllNormalEmployees(req: RequestInterface, res:Response){
        try {
            const myService = this.service;
            const filter: object = { employeeType:EmployeeType.NORMAL };
            const employees = await myService.get(filter);
            if (!employees) throw new ApiError(httpStatus.NOT_FOUND, 'could not find employees');
            res.status(httpStatus.ACCEPTED).send({ ...employees });
        } catch (err) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.message);
        }
    }
}

export const employeeController = new EmployeeController(employeeService)