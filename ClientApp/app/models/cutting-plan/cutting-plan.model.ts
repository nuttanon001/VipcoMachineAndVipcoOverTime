import { Material,ProjectCodeDetail } from "../model.index";

export interface CuttingPlan {
    CuttingPlanId: number;
    CuttingPlanNo?: string;
    Description?: string;
    TypeCuttingPlan?: number;
    Quantity?: number;
    MaterialSize?: string;
    MaterialGrade?: string;
    Creator?: string;
    CreateDate?: Date;
    Modifyer?: string;
    ModifyDate?: Date;
    ProjectCodeDetailId?: number;
    //FK
    ProjectCodeDetail?: ProjectCodeDetail;
    //ViewModel
    ProjectCodeString?: string;
    TypeCuttingPlanString?: string;
}