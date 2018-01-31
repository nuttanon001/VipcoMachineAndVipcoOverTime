export interface OptionSchedule {
    Filter? : string;
    TypeMachineId? : number;
    JobNo? : number;
    Level2?: number;
    Skip? : number;
    Take? : number;
    Mode?: number;
    Creator?: string;
    Require?: string;
    TaskMachineId?: number;
    // template
    CreatorName?: string;
    RequireName?: string;
}