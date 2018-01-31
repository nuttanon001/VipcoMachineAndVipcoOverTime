import { TypeMachine, MachineHasOperator } from "../model.index";

export interface Machine {
    MachineId : number;
    MachineCode? : string;
    MachineName? : string;
    InstalledDate ? :Date;
    Model? : string;
    Brand? : string;
    MachineImage?: Array<number>;
    MachineImageString?: string;
    Remark? : string;
    MachineStatus ? : number;
    Creator ? : string;
    CreateDate? : Date;
    Modifyer? : string;
    ModifyDate ? :Date;
    TypeMachineId?: number;
    // Fk
    TypeMachine?: TypeMachine;
    MachineHasOperators?: Array<MachineHasOperator>;
    // ViewModel
    TypeMachineString?: string;
}