import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
// componentes
// import { ProjectMasterComponent,ProjectCenterComponent } from "../../components/project-master/project.index";
import { MachineCenterComponent } from "../../components/machine/machine-center.component";
import { MachineMasterComponent } from "../../components/machine/machine-master.component";
// service
import { AuthGuard } from "../../services/auth/auth-guard.service";

const machineRoutes: Routes = [
    {
        path: "machine",
        component: MachineCenterComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: "",
                component: MachineMasterComponent,
            }
        ],
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(machineRoutes)
    ],
    exports: [
        RouterModule
    ]
})

export class MachineRouters { }