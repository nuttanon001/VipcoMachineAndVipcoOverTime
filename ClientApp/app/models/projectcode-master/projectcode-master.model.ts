import { ProjectCodeDetail } from "../model.index";

export interface ProjectCodeMaster {
    ProjectCodeMasterId: number;
    ProjectCode?: string;
    ProjectName?: string;
    StartDate?: Date;
    EndDate?: Date;
    Creator?: string;
    CreateDate?: Date;
    Modifyer?: string;
    ModifyDate?: Date;

    ProjectCodeDetails?: Array<ProjectCodeDetail>;
}