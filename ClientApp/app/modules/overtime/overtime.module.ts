import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// 3rd party
import "rxjs/Rx";
import "hammerjs";
// component
import { OverTimeCenterComponent } from "../../components/overtime/overtime-center.component";
import { OvertimeEditComponent } from "../../components/overtime/overtime-edit.component";
import { OvertimeMasterComponent } from "../../components/overtime/overtime-master.component";
import { OvertimeViewComponent } from "../../components/overtime/overtime-view.component";
import { OvertimeScheduleComponent } from "../../components/overtime/overtime-schedule.component";
import { OverTimeReportComponent } from "../../components/overtime/overtime-report.component";
import { OvertimeReportSummaryComponent } from "../../components/overtime/overtime-report-summary.component";
import { OverTimeChartComponent } from "../../components/overtime/overtime-chart.component";
import { OverTimeReportSummaryByProComponent } from "../../components/overtime/overtime-report-summary-bypro.component";
// module
import { OverTimeRouters } from "./overtime.routing";
import {
    CustomMaterialModule, ValidationModule,
} from "../module.index";
// services
import {
    OverTimeMasterService,
    OverTimeMasterServiceCommunicate
} from "../../services/overtime-master/overtime-master.service";
import { OverTimeDetailService } from "../../services/overtime-detail/overtime-detail.service";
import { DataTableServiceCommunicate } from "../../services/data-table/data-table.service";
import { EmployeeGroupService } from "../../services/employee-group/employee-group.service";
import { ProjectCodeMasterService } from "../../services/projectcode-master/projectcode-master.service";

@NgModule({
    declarations: [
        OverTimeCenterComponent,
        OvertimeMasterComponent,
        OvertimeViewComponent,
        OvertimeEditComponent,
        OvertimeScheduleComponent,
        OverTimeReportComponent,
        OvertimeReportSummaryComponent,
        OverTimeChartComponent,
        OverTimeReportSummaryByProComponent
    ],
    imports: [
        // angular
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        // custom
        CustomMaterialModule,
        ValidationModule,
        OverTimeRouters,
    ],
    exports: [
    ],
    providers: [
        OverTimeMasterService,
        OverTimeMasterServiceCommunicate,
        OverTimeDetailService,
        ProjectCodeMasterService,
        ProjectCodeMasterService,
        EmployeeGroupService,
        // dataTableServiceCommunicate,
    ],
})

export class OverTimeModule { }