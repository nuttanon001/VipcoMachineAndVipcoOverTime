import { Employee,Machine } from "../model.index";

export interface MachineHasOperator {
    MachineOperatorId: number;
    Remark?: string;
    Creator?: string;
    CreateDate?: Date;
    Modifyer?: string;
    ModifyDate?: Date;
    EmpCode?: string;
    MachineId?: number;
    Employee?: Employee;
    Machine?: Machine;
    //ViewModel
    EmployeeName?: string;
}