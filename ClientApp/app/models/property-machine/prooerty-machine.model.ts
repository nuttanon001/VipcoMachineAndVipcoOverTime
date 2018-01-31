import { Machine } from "../model.index";

export interface PropertyMachine {
    PropertyMachineId: number;
    PropertyName?: string;
    Value?: number;
    Remark?: string;
    Creator?: string;
    CreateDate?: Date;
    Modifyer?: string;
    ModifyDate?: Date;
    MachineId?: number;

    Machine?: Machine;
}