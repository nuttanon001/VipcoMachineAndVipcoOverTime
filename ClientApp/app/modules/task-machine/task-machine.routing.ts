import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
// componentes
import { TaskMachineCenterComponent } from "../../components/task-machine/task-machine-center.component";
import { TaskMachineMasterComponent } from "../../components/task-machine/task-machine-master.component";
import { TaskMachineScheduleComponent } from "../../components/task-machine/task-machine-schedule.component";
import { TaskMachineChartComponent } from "../../components/task-machine/task-machine-chart.component";
import { TaskMacineLinkmailComponent } from "../../components/task-machine/task-macine-linkmail.component";
import { MachineScheduleComponent } from "../../components/task-machine/machine-schedule.component";
// service
import { AuthGuard } from "../../services/auth/auth-guard.service";

const taskMachineRoutes: Routes = [
    {
        path: "task-machine",
        component: TaskMachineCenterComponent,
        children: [
            {
                path: "jobcard-detail/:condition",
                component: TaskMachineMasterComponent,
                canActivate: [AuthGuard],
            },
            {
                path: "task-machine-schedule/:condition",
                component: TaskMachineScheduleComponent,
            },
            {
                path: "machine-schedule/:condition",
                component: MachineScheduleComponent,
            },
            {
                path: "link-mail/:condition",
                component: TaskMacineLinkmailComponent,
            },
            {
                path: "machine-schedule",
                component: MachineScheduleComponent,
            },
            {
                path: "task-machine-schedule",
                component: TaskMachineScheduleComponent,
            },
            {
                path: "task-machine-chart",
                component: TaskMachineChartComponent,
            },
            {
                path: "",
                component: TaskMachineMasterComponent,
                canActivate: [AuthGuard],
            }
        ],
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(taskMachineRoutes)
    ],
    exports: [
        RouterModule
    ]
})

export class TaskMachineRouters { }