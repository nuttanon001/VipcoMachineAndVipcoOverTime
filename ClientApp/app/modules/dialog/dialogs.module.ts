import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import "rxjs/Rx";
import "hammerjs";
// services
import {
    JobCardMasterService, JobCardDetailService,
    DialogsService
} from "../../services/service.index";
// components
import {
    ConfirmDialog, ContextDialog,
    CuttingPlanDialogComponent, EmployeeDialogComponent,
    ErrorDialog, MachineDialogComponent,
    MaterialDialogComponent, ProjectDialogComponent,
    StandardTimeDialogComponent, StdtimeSelectDialogComponent,
    UomDialogComponent, JobcardDialogComponent,
    JobCardWatingDialogComponent, TaskMachineDialogComponent,
    EmployeeGroupDialogComponent, EmployeeByGroupDialogComponent,
    OvertimeDialogComponent, MessageDialogComponent, EmployeeByGroupMisDialogComponent,
    EmpoyeeGroupmisDialogComponent, JobCardDetailAssignDialogComponent,
    MachineScheduleDialogComponent
} from "../../components/dialog/dialog.index";
import { JobCardViewWaitingComponent } from "../../components/jobcard/jobcard-view-waiting.component";
import { OvertimeViewWaitingComponent } from "../../components/overtime/overtime-view-waiting.component";
// modules
import { CustomMaterialModule } from "../customer-material/customer-material.module";
import { ValidationModule } from "../validation/validation.module";
import { CuttingPlanModule } from "../cutting-plan/cutting-plan.module";
import { JobCardModule } from "../jobcard/jobcard.module";

@NgModule({
    imports: [
        // angular
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        // customer Module
        ValidationModule,
        CustomMaterialModule,
        // mark JobCardModule,
    ],
    exports: [
        ErrorDialog,
        ConfirmDialog,
        ContextDialog,
        UomDialogComponent,
        ProjectDialogComponent,
        MachineDialogComponent,
        EmployeeDialogComponent,
        MaterialDialogComponent,
        CuttingPlanDialogComponent,
        StandardTimeDialogComponent,
        StdtimeSelectDialogComponent,
        JobCardWatingDialogComponent,
        JobcardDialogComponent,
        TaskMachineDialogComponent,
        EmployeeGroupDialogComponent,
        EmployeeByGroupDialogComponent,
        OvertimeDialogComponent,
        MessageDialogComponent,
        EmployeeByGroupMisDialogComponent,
        EmpoyeeGroupmisDialogComponent,
        JobCardDetailAssignDialogComponent,
        MachineScheduleDialogComponent
    ],
    declarations: [
        ErrorDialog,
        ConfirmDialog,
        ContextDialog,
        UomDialogComponent,
        MachineDialogComponent,
        ProjectDialogComponent,
        EmployeeDialogComponent,
        MaterialDialogComponent,
        CuttingPlanDialogComponent,
        StandardTimeDialogComponent,
        StdtimeSelectDialogComponent,
        JobCardWatingDialogComponent,
        JobcardDialogComponent,
        TaskMachineDialogComponent,
        EmployeeGroupDialogComponent,
        EmployeeByGroupDialogComponent,
        OvertimeDialogComponent,
        MessageDialogComponent,
        EmployeeByGroupMisDialogComponent,
        EmpoyeeGroupmisDialogComponent,
        // view Component
        JobCardViewWaitingComponent,
        OvertimeViewWaitingComponent,
        JobCardDetailAssignDialogComponent,
        MachineScheduleDialogComponent
    ],
    providers: [
        DialogsService,
        JobCardMasterService,
        JobCardDetailService,

    ],
    // a list of components that are not referenced in a reachable component template.
    // doc url is :https://angular.io/guide/ngmodule-faq
    entryComponents: [
        ErrorDialog,
        ConfirmDialog,
        ContextDialog,
        UomDialogComponent,
        ProjectDialogComponent,
        MachineDialogComponent,
        MaterialDialogComponent,
        EmployeeDialogComponent,
        CuttingPlanDialogComponent,
        StandardTimeDialogComponent,
        StdtimeSelectDialogComponent,
        JobCardWatingDialogComponent,
        JobcardDialogComponent,
        JobCardViewWaitingComponent,
        TaskMachineDialogComponent,
        EmployeeGroupDialogComponent,
        EmployeeByGroupDialogComponent,
        OvertimeDialogComponent,
        MessageDialogComponent,
        EmployeeByGroupMisDialogComponent,
        EmpoyeeGroupmisDialogComponent,
        JobCardDetailAssignDialogComponent,
        MachineScheduleDialogComponent
    ],
})
export class DialogsModule { }
