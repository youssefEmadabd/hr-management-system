import { Document, ObjectId } from 'mongoose';
import {EmployeeType} from './employee.enums';

export interface IEmployee extends Document {
    _id: ObjectId,
    username: string;
    password: string;
    employeeType: EmployeeType;
    attendance: [Date];
    createdAt?: Date;
    updatedAt?: Date;
}