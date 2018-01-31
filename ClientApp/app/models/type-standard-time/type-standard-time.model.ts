import { StandardTime } from "../model.index";

export interface TypeStandardTime {
    TypeStandardTimeId: number;
    Name?: string;
    Creator?: string;
    CreateDate?: Date;
    Modifyer?: string;
    ModifyDate?: Date;
    //Fk
    TypeMachineId?: number;
    StandardTimes?: Array<StandardTime>;
    //ViewModel
    TypeMachineString?: string;
}