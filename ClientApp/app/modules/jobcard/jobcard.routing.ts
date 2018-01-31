import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
// componentes
import { JobCardCenterComponent } from "../../components/jobcard/jobcard-center.component";
import { JobCardMasterComponent } from "../../components/jobcard/jobcard-master.component";
import { JobCardWaitingComponent } from "../../components/jobcard/jobcard-waiting.component";
// service
import { AuthGuard } from "../../services/auth/auth-guard.service";

const jobcardRoutes: Routes = [
    {
        path: "jobcard",
        component: JobCardCenterComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: "jobcard-waiting",
                component: JobCardWaitingComponent,
            },
            {
                path: "jobcard-waiting-edit/:condition",
                component: JobCardMasterComponent,
            },
            {
                path: "",
                component: JobCardMasterComponent,
            }
        ],
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(jobcardRoutes)
    ],
    exports: [
        RouterModule
    ]
})

export class JobCardRouters { }