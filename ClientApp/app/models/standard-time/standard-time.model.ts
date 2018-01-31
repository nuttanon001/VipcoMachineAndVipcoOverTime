import { TypeStandardTime, Material } from "../model.index";

export interface StandardTime {
    StandardTimeId: number;
    StandardTimeCode?: string;
    Description?: string;
    Remark?: string;
    StandardTimeValue?: number;
    PreparationBefor?: number;
    PreparationAfter?: number;
    CalculatorTime?: number;
    Creator?: string;
    CreateDate?: Date;
    Modifyer?: string;
    ModifyDate?: Date;
    //Fk
    GradeMaterialId?: number;
    TypeStandardTimeId?: number;
    // viewmodels
    GradeMaterialString?: string;
    TypeStandardTimeString?: string;
}