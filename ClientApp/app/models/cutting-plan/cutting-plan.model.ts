import { Material,ProjectCodeDetail } from "../model.index";

export interface CuttingPlan {
    CuttingPlanId: number;
    CuttingPlanNo?: string;
    Description?: string;
    Quantity?: number;
    MaterialSize?: string;
    MaterialGrade?: string;
    TypeCuttingPlan?: number;
    Creator?: string;
    CreateDate?: Date;
    Modifyer?: string;
    ModifyDate?: Date;
    //FK
    ProjectCodeDetailId?: number;
    ProjectCodeDetail?: ProjectCodeDetail;
    //ViewModel
    ProjectCodeString?: string;
    TypeCuttingPlanString?: string;
}