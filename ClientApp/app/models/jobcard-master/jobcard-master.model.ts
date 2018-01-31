import {
    Employee, ProjectCodeMaster,
    JobCardDetail, AttachFile
} from "../model.index";

export interface JobCardMaster {
    JobCardMasterId: number;
    JobCardMasterNo?: string;
    JobCardMasterStatus?: number;
    Description?: string;
    Remark?: string;
    JobCardDate?: Date;
    DueDate?: Date;
    Creator?: string;
    CreateDate?: Date;
    Modifyer?: string;
    ModifyDate?: Date;
    //Fk
    EmpWrite?: string;
    EmpRequire?: string;
    GroupCode?: string;
    ProjectCodeDetailId?: number;
    TypeMachineId?: number;
    JobCardDetails?: Array<JobCardDetail>;
    //ViewModel
    ProjectDetailString?: string;
    TypeMachineString?: string;
    StatusString?: string;
    EmployeeRequireString?: string;
    EmployeeWriteString?: string;
    //Attach
    AttachFile?: FileList;
    RemoveAttach?: Array<number>;
    // Option
    MachineUser?: boolean;
}