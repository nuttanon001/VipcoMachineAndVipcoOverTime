import { TaskMachineHasOverTime } from "../model.index";

export interface TaskMachine {
    TaskMachineId: number;
    TaskMachineName?: string;
    Description?: string;
    Priority?: number;
    TotalQuantity?: number;
    CurrentQuantity?: number;
    PlannedStartDate?: Date;
    PlannedEndDate?: Date;
    ActualStartDate?: Date;
    ActualEndDate?: Date;
    ActualManHours?: number;
    TaskMachineStatus?: number;
    Creator?: string;
    CreateDate?: Date;
    Modifyer?: string;
    ModifyDate?: Date;
    //FK
    MachineId?: number;
    JobCardDetailId?: number;
    AssignedBy?: string;
    PrecedingTaskMachineId?: number;
    TaskMachineHasOverTimes?: Array<TaskMachineHasOverTime>;
    //ViewModel
    //PlannedStartTime?: string;
    //PlannedEndTime?: string;
    //ActualStartTime?: string;
    //ActualEndTime?: string;
    MachineString?: string;
    CuttingPlanNo?: string;
    AssignedByString?: string;
    StandardTimeId?: number;
}