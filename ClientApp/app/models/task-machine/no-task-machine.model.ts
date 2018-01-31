export interface NoTaskMachine {
    NoTaskMachineId: number;
    NoTaskMachineCode?:string;
    Description?:string;
    Remark?:string;
    Quantity ?: number;
    Date ?: Date;
    Creator?:string;
    CreateDate ?: Date;
    Modifyer?:string;
    ModifyDate ?: Date;
    // FK
    JobCardDetailId ?: number;
    AssignedBy?:string;
    GroupCode?: string;
    GroupMis?:string;
    // ViewModel
    AssignedByString?: string;
    GroupCodeString?: string;
    GroupMisString?: string;
}