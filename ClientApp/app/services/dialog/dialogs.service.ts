import { MatDialogRef, MatDialog, MatDialogConfig } from "@angular/material";
import { Injectable, ViewContainerRef } from "@angular/core";
import { Observable } from "rxjs/Rx";

// models
import {
    CuttingPlan,Employee,JobCardDetail,
    Machine,Material,ProjectCodeDetail,
    StandardTime,UnitsMeasure,JobCardMaster,
    TaskMachine, ProjectCodeMaster,
    EmployeeGroup, OverTimeMaster,
    MessageDialog, EmployeeGroupMis
} from "../../models/model.index";

// components
import {
    ConfirmDialog,ContextDialog,
    ErrorDialog, ProjectDialogComponent,
    MaterialDialogComponent, EmployeeDialogComponent,
    MachineDialogComponent, StandardTimeDialogComponent,
    StdtimeSelectDialogComponent, CuttingPlanDialogComponent,
    UomDialogComponent, JobcardDialogComponent,
    JobCardWatingDialogComponent, TaskMachineDialogComponent,
    EmployeeGroupDialogComponent, EmployeeByGroupDialogComponent,
    OvertimeDialogComponent, MessageDialogComponent,
    EmployeeByGroupMisDialogComponent, EmpoyeeGroupmisDialogComponent
 } from "../../components/dialog/dialog.index";

@Injectable()
export class DialogsService {

    // width and height > width and height in scss master-dialog
    width: string = "950px";
    height: string = "500px";

    constructor(private dialog: MatDialog) { }

    public confirm(title: string, message: string, viewContainerRef: ViewContainerRef): Observable<boolean> {

        let dialogRef: MatDialogRef<ConfirmDialog>;
        let config: MatDialogConfig = new MatDialogConfig();
        config.viewContainerRef = viewContainerRef;

        dialogRef = this.dialog.open(ConfirmDialog, config);

        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.message = message;

        return dialogRef.afterClosed();
    }

    public context(title: string, message: string, viewContainerRef: ViewContainerRef): Observable<boolean> {

        let dialogRef: MatDialogRef<ContextDialog>;
        let config: MatDialogConfig = new MatDialogConfig();
        config.viewContainerRef = viewContainerRef;

        dialogRef = this.dialog.open(ContextDialog, config);

        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.message = message;

        return dialogRef.afterClosed();
    }

    public error(title: string, message: string, viewContainerRef: ViewContainerRef): Observable<boolean> {

        let dialogRef: MatDialogRef<ErrorDialog>;
        let config: MatDialogConfig  = new MatDialogConfig();
        config.viewContainerRef = viewContainerRef;

        dialogRef = this.dialog.open(ErrorDialog, config);

        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.message = message;

        return dialogRef.afterClosed();
    }

    public dialogSelectedDetail(viewContainerRef: ViewContainerRef): Observable<ProjectCodeDetail> {
        let dialogRef: MatDialogRef<ProjectDialogComponent>;
        let config: MatDialogConfig  = new MatDialogConfig();

        // config
        config.viewContainerRef = viewContainerRef;
        config.data = 0;
        // config.height = this.height;
        // config.width= this.width;
        config.hasBackdrop = true;

        // open dialog
        dialogRef = this.dialog.open(ProjectDialogComponent, config);
        return dialogRef.afterClosed();
    }

    public dialogSelectedMaster(viewContainerRef: ViewContainerRef,mode:number = 1): Observable<ProjectCodeMaster> {
        let dialogRef: MatDialogRef<ProjectDialogComponent>;
        let config: MatDialogConfig  = new MatDialogConfig();

        // config
        config.viewContainerRef = viewContainerRef;
        config.data = mode;
        // config.height = this.height;
        // config.width= this.width;
        config.hasBackdrop = true;

        // open dialog
        dialogRef = this.dialog.open(ProjectDialogComponent, config);
        return dialogRef.afterClosed();
    }

    public dialogSelectMaterial(viewContainerRef: ViewContainerRef): Observable<Material> {
        let dialogRef: MatDialogRef<MaterialDialogComponent>;
        let config: MatDialogConfig  = new MatDialogConfig();

        // config
        config.viewContainerRef = viewContainerRef;
        config.height = this.height;
        config.width= this.width;
        config.hasBackdrop = true;

        // open dialog
        dialogRef = this.dialog.open(MaterialDialogComponent, config);
        return dialogRef.afterClosed();
    }

    public dialogSelectEmployee(viewContainerRef: ViewContainerRef, mode:string = ""): Observable<Array<Employee>> {

        let dialogRef: MatDialogRef<EmployeeDialogComponent>;
        let config: MatDialogConfig  = new MatDialogConfig();

        // config
        config.viewContainerRef = viewContainerRef;
        config.data = mode;
        // config.height = this.height;
        // config.width= this.width;
        config.hasBackdrop = true;

        // open dialog
        dialogRef = this.dialog.open(EmployeeDialogComponent, config);
        return dialogRef.afterClosed();
    }

    public dialogSelectEmployeeWithGroup(viewContainerRef: ViewContainerRef, groupCode: string = ""): Observable<Array<Employee>> {

        let dialogRef: MatDialogRef<EmployeeByGroupDialogComponent>;
        let config: MatDialogConfig  = new MatDialogConfig();

        // config
        config.viewContainerRef = viewContainerRef;
        config.data = groupCode;
        // config.height = this.height;
        // config.width= this.width;
        config.hasBackdrop = true;

        // open dialog
        dialogRef = this.dialog.open(EmployeeByGroupDialogComponent, config);
        return dialogRef.afterClosed();
    }

    public dialogSelectEmployeeWithGroupMis(viewContainerRef: ViewContainerRef, groupMisCode: string = ""): Observable<Array<Employee>> {

        let dialogRef: MatDialogRef<EmployeeByGroupMisDialogComponent>;
        let config: MatDialogConfig = new MatDialogConfig();

        // config
        config.viewContainerRef = viewContainerRef;
        config.data = groupMisCode;
        // config.height = this.height;
        // config.width= this.width;
        config.hasBackdrop = true;

        // open dialog
        dialogRef = this.dialog.open(EmployeeByGroupMisDialogComponent, config);
        return dialogRef.afterClosed();
    }

    public dialogSelectMachine(viewContainerRef: ViewContainerRef, mode:number = 0): Observable<Machine> {
        let dialogRef: MatDialogRef<MachineDialogComponent>;
        let config: MatDialogConfig  = new MatDialogConfig();

        // config
        config.viewContainerRef = viewContainerRef;
        config.data = mode;
        // config.height = this.height;
        // config.width = this.width;
        config.hasBackdrop = true;

        // open dialog
        dialogRef = this.dialog.open(MachineDialogComponent, config);
        return dialogRef.afterClosed();
    }

    public dialogNewEditStandardTime(viewContainerRef: ViewContainerRef, standard: StandardTime,): Observable<StandardTime> {
        let dialogRef: MatDialogRef<StandardTimeDialogComponent>;
        let config: MatDialogConfig  = new MatDialogConfig();

        // config
        config.viewContainerRef = viewContainerRef;
        config.data = standard;
        // config.height = this.height;
        // config.width= this.width;
        config.hasBackdrop = true;

        // open dialog
        dialogRef = this.dialog.open(StandardTimeDialogComponent, config);
        return dialogRef.afterClosed();
    }

    public dialogSelectCuttingPlan(viewContainerRef: ViewContainerRef, mode:number = 0): Observable<CuttingPlan> {
        let dialogRef: MatDialogRef<CuttingPlanDialogComponent>;
        let config: MatDialogConfig  = new MatDialogConfig();

        // config
        config.viewContainerRef = viewContainerRef;
        if (mode) {
            config.data = mode;
        }
        // config.height = this.height;
        // config.width= this.width;
        config.hasBackdrop = true;

        // open dialog
        dialogRef = this.dialog.open(CuttingPlanDialogComponent, config);
        return dialogRef.afterClosed();
    }

    public dialogSelectStandardTime(viewContainerRef: ViewContainerRef, mode:number = 0): Observable<StandardTime> {
        let dialogRef: MatDialogRef<StdtimeSelectDialogComponent>;
        let config: MatDialogConfig  = new MatDialogConfig();

        // config
        config.viewContainerRef = viewContainerRef;
        config.data = mode;
        // config.height = this.height;
        // config.width= this.width;
        config.hasBackdrop = true;

        // open dialog
        dialogRef = this.dialog.open(StdtimeSelectDialogComponent, config);
        return dialogRef.afterClosed();
    }

    public dialogSelectUom(viewContainerRef: ViewContainerRef): Observable<UnitsMeasure> {
        let dialogRef: MatDialogRef<UomDialogComponent>;
        let config: MatDialogConfig  = new MatDialogConfig();

        // config
        config.viewContainerRef = viewContainerRef;
        // config.height = this.height;
        // config.width= this.width;
        config.hasBackdrop = true;

        // open dialog
        dialogRef = this.dialog.open(UomDialogComponent, config);
        return dialogRef.afterClosed();
    }

    public dialogSelectedJobCardDetail(viewContainerRef: ViewContainerRef,mode:number = 0): Observable<JobCardDetail> {
        let dialogRef: MatDialogRef<JobcardDialogComponent>;
        let config: MatDialogConfig  = new MatDialogConfig();

        // config
        config.viewContainerRef = viewContainerRef;
        config.data = mode;
        // config.height = this.height;
        // config.width = this.width;
        config.hasBackdrop = true;

        // open dialog
        dialogRef = this.dialog.open(JobcardDialogComponent,config);
        return dialogRef.afterClosed();
    }

    public dialogSelectedJobCardDetailForWait(viewContainerRef: ViewContainerRef, jobCardMasters: Array<JobCardMaster>): Observable<JobCardDetail> {
        let dialogRef: MatDialogRef<JobCardWatingDialogComponent>;
        let config: MatDialogConfig  = new MatDialogConfig();

        // config
        config.viewContainerRef = viewContainerRef;
        config.data = jobCardMasters;
        // config.height = this.height;
        // config.width = this.width;
        config.hasBackdrop = true;

        // open dialog
        dialogRef = this.dialog.open(JobCardWatingDialogComponent, config);
        return dialogRef.afterClosed();
    }

    public dialogUpdateProgessTaskMachine(viewContainerRef: ViewContainerRef, TaskMachineId: number): Observable<TaskMachine> {
        let dialogRef: MatDialogRef<TaskMachineDialogComponent>;
        let config: MatDialogConfig  = new MatDialogConfig();

        // config
        config.viewContainerRef = viewContainerRef;
        config.data = TaskMachineId;
        config.height = this.height;
        config.width = this.width;
        config.hasBackdrop = true;

        // open dialog
        dialogRef = this.dialog.open(TaskMachineDialogComponent, config);
        return dialogRef.afterClosed();
    }

    public dialogSelectedEmployeeGroup(viewContainerRef: ViewContainerRef): Observable<EmployeeGroup> {
        let dialogRef: MatDialogRef<EmployeeGroupDialogComponent>;
        let config: MatDialogConfig  = new MatDialogConfig();

        // config
        config.viewContainerRef = viewContainerRef;
        // config.height = this.height;
        // config.width = this.width;
        config.hasBackdrop = true;

        // open dialog
        dialogRef = this.dialog.open(EmployeeGroupDialogComponent, config);
        return dialogRef.afterClosed();
    }

    public dialogSelectedEmployeeGroupMis(viewContainerRef: ViewContainerRef): Observable<EmployeeGroupMis> {
        let dialogRef: MatDialogRef<EmpoyeeGroupmisDialogComponent>;
        let config: MatDialogConfig = new MatDialogConfig();

        // config
        config.viewContainerRef = viewContainerRef;
        // config.height = this.height;
        // config.width = this.width;
        config.hasBackdrop = true;

        // open dialog
        dialogRef = this.dialog.open(EmpoyeeGroupmisDialogComponent, config);
        return dialogRef.afterClosed();
    }

    public dialogSelectedOverTimeWaiting(viewContainerRef: ViewContainerRef, overTimeMasterId: number): Observable<OverTimeMaster> {
        let dialogRef: MatDialogRef<OvertimeDialogComponent>;
        let config: MatDialogConfig  = new MatDialogConfig();

        // config
        config.viewContainerRef = viewContainerRef;
        config.data = overTimeMasterId;
        config.hasBackdrop = true;

        // open dialog
        dialogRef = this.dialog.open(OvertimeDialogComponent, config);
        return dialogRef.afterClosed();
    }

    public dialogMessage(viewContainerRef: ViewContainerRef, message: MessageDialog): Observable<boolean> {
        let dialogRef: MatDialogRef<MessageDialogComponent>;
        let config: MatDialogConfig = new MatDialogConfig();

        // config
        config.viewContainerRef = viewContainerRef;
        config.data = message;
        config.hasBackdrop = true;

        // open dialog
        dialogRef = this.dialog.open(MessageDialogComponent, config);
        return dialogRef.afterClosed();
    }

}
