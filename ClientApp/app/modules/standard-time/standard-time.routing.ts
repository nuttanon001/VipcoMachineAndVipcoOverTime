import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
// componentes
import { StandardTimeCenterComponent } from "../../components/standard-time/standard-time-center.component";
import { StandardTimeMasterComponent } from "../../components/standard-time/standard-time-master.component";
// service
import { AuthGuard } from "../../services/auth/auth-guard.service";

const standardTimeRoutes: Routes = [
    {
        path: "standard-time",
        component: StandardTimeCenterComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: "",
                component: StandardTimeMasterComponent,
            }
        ],
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(standardTimeRoutes)
    ],
    exports: [
        RouterModule
    ]
})

export class StandardTimeRouters { }