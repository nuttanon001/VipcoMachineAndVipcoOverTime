import { ProjectCodeMaster } from "../model.index";

export interface ProjectCodeDetail {
    ProjectCodeDetailId: number;
    ProjectCodeDetailCode?: string;
    Description?: string;
    Creator?: string;
    CreateDate?: Date;
    Modifyer?: string;
    ModifyDate?: Date;
    ProjectCodeMasterId?: number;
    ProjectCodeMaster?: ProjectCodeMaster;
    //ViewModel
    FullProjectLevelString?: string;
}