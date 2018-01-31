import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
// componentes
import { OverTimeCenterComponent } from "../../components/overtime/overtime-center.component";
import { OvertimeMasterComponent } from "../../components/overtime/overtime-master.component";
import { OvertimeScheduleComponent } from "../../components/overtime/overtime-schedule.component";
import { OvertimeReportSummaryComponent } from "../../components/overtime/overtime-report-summary.component";
import { OverTimeChartComponent } from "../../components/overtime/overtime-chart.component";
// service
import { AuthGuard } from "../../services/auth/auth-guard.service";

const overTimeRoutes: Routes = [
    {
        path: "overtime",
        component: OverTimeCenterComponent,
        children: [
            {
                path: "summary-overtime",
                component: OvertimeReportSummaryComponent,
            },
            {
                path: "chart-overtime",
                component: OverTimeChartComponent,
            },
            {
                path: "approve-overtime",
                component: OvertimeScheduleComponent,
                canActivate: [AuthGuard],
            },
            {
                path: "",
                component: OvertimeMasterComponent,
                canActivate: [AuthGuard],
            }
        ],
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(overTimeRoutes)
    ],
    exports: [
        RouterModule
    ]
})

export class OverTimeRouters { }