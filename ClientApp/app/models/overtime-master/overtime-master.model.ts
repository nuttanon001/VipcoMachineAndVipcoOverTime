import { OverTimeDetail } from "../overtime-detail/overtime-detail.model";

export interface OverTimeMaster {
    OverTimeMasterId: number;
    OverTimeDate: Date;
    InfoPlan?: string;
    InfoActual?: string;
    OverTimeStatus?: number;
    HiddenText?: string;
    Creator?: string;
    CreateDate?: Date;
    Modifyer?: string;
    ModifyDate?: Date;
    /// <summary>
    /// Update 26/10/18
    /// </summary>
    BomCode?: string;
    TypeCode?: string;
    /// <summary>
    /// Update 20/11/18
    /// </summary>
    LocationCode?: string;
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