import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
// componentes
import { CuttingCenterComponent } from "../../components/cutting-plan/cutting-center.component";
import { CuttingMasterComponent } from "../../components/cutting-plan/cutting-master.component";
import { ImportCsvComponent } from "../../components/cutting-plan/import-csv.component";
// service
import { AuthGuard } from "../../services/auth/auth-guard.service";

const cuttingPlanRoutes: Routes = [
    {
        path: "cutting-plan",
        component: CuttingCenterComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: "import-csv",
                component: ImportCsvComponent,
            },
            {
                path: "",
                component: CuttingMasterComponent,
            }
        ],
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(cuttingPlanRoutes)
    ],
    exports: [
        RouterModule
    ]
})

export class CuttingPlanRouters { }