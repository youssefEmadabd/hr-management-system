import mongooseLeanVirtuals from 'mongoose-lean-virtuals';
import { Schema, model } from 'mongoose';

import { IEmployee, EmployeeType } from '../types';

const EmployeeSchema: Schema = new Schema<IEmployee>({
    username: { type: String, required: true, index: true, unique: true },
    password: { type: String, required: true, index: true, unique: true },
    employeeType: {type: String,enum:["normal", "human resource"], required:true},
    attendance: [{type: String}],
})

EmployeeSchema.plugin(mongooseLeanVirtuals);

/**
 * @typedef Employee
 */
export default model<IEmployee>('Employee', EmployeeSchema);
