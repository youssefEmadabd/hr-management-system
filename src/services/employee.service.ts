import Service from "./Service";
import { Employee } from "../models";
import { IEmployee } from "../types";
export class EmployeeService extends Service<IEmployee>{
    async isUsernameUnique(username: string): Promise<boolean> {
        const Model = this.model;
        const employee: IEmployee = await Model.findOne({ username });
        if (employee) {
            return false;
        }
        return true;
    }
}

export const employeeService = new EmployeeService(Employee);
