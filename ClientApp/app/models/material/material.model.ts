import {
    TypeStandardTime, ClassificationMaterial,
    GradeMaterial, StandardTime
} from "../model.index";

export interface Material {
    MaterialId: number;
    Description?: string;
    Width?: number;
    Length?: number;
    Thickness?: number;
    Weight?: number;
    SquareMeter?: number;
    Creator?: string;
    CreateDate?: Date;
    Modifyer?: string;
    ModifyDate?: Date;
    TypeStandardTimeId?: number;
    ClassificationId?: number;
    GradeMaterialId?: number;
    // FK
    TypeStandardTime?: TypeStandardTime;
    ClassificationMaterial?: ClassificationMaterial;
    GradeMaterial?: GradeMaterial;
    StandardTime?: StandardTime;
    // ViewModel
    ClassificationString?: string;
    GradeString?: string;
}