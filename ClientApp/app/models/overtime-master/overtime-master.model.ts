import { OverTimeDetail } from "../overtime-detail/overtime-detail.model";

export interface OverTimeMaster {
    OverTimeMasterId: number;
    OverTimeDate: Date;
    InfoPlan?: string;
    InfoActual?: string;
    OverTimeStatus?: number;
    Creator?: string;
    CreateDate?: Date;
    Modifyer?: string;
    ModifyDate?: Date;
    // FK
    // Employee Approve
    EmpApprove?: string;
    // Employee Require
    EmpRequire?: string;
    // OverTime
    LastOverTimeId?: number;
    // EmployeeGroup
    GroupCode?: string;
    // EmployeeGroupMis
    GroupMIS?: string;
    // ProjectMaster
    ProjectCodeMasterId?: number;
    // OverTimeDetail
    OverTimeDetails?: Array<OverTimeDetail>;
    // ViewModel
    ApproveString?:string;
    RequireString?:string;
    GroupString?: string;
    GroupMisString?: string;
    ProjectMasterString?:string;
}