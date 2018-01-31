export interface TaskMachineHasOverTime {
    OverTimeId: number;
    Description?: string;
    OverTimeDate?: Date;
    OverTimePerDate?: number;
    Creator?: string;
    CreateDate?: Date;
    Modifyer?: string;
    ModifyDate?: Date;
    /** FK */
    TaskMachineId?: number;
    EmpCode?: string;
    // ViewModel
    NameThai?: string;
}