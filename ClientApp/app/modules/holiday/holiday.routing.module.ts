import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
// componentes
import { HolidayCenterComponent } from "../../components/holiday-overtime/holiday-center.component";
import { HolidayMasterComponent } from "../../components/holiday-overtime/holiday-master.component";
// service
import { AuthGuard } from "../../services/auth/auth-guard.service";

const holidayRoutes: Routes = [
    {
        path: "holiday",
        component: HolidayCenterComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: "",
                component: HolidayMasterComponent,
            }
        ],
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(holidayRoutes)
    ],
    exports: [
        RouterModule
    ]
})

export class HolidayRoutingModule { }