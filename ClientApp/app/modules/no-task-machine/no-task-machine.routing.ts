import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
// componentes
import { NoTaskMachineCenterComponent } from "../../components/no-task-machine/notask-machine-center.component";
import { NoTaskMachineMasterComponent } from "../../components/no-task-machine/notask-machine-master.component";
// service
import { AuthGuard } from "../../services/auth/auth-guard.service";

const noTaskMachineRoutes: Routes = [
    {
        path: "notask-machine",
        component: NoTaskMachineCenterComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: "notask-withjob/:condition",
                component: NoTaskMachineMasterComponent,
                canActivate: [AuthGuard],
            },
            {
                path: "",
                component: NoTaskMachineMasterComponent,
            }
        ],
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(noTaskMachineRoutes)
    ],
    exports: [
        RouterModule
    ]
})

export class NoTaskMachineRoutingModule { }