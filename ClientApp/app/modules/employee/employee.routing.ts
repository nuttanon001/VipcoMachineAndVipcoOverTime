import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
// componentes
import { EmployeeCenterComponent } from "../../components/employee/employee-center.component";
import { EmployeeMasterComponent } from "../../components/employee/employee-master.component";
// service
import { AuthGuard } from "../../services/auth/auth-guard.service";

const employeeRoutes: Routes = [
    {
        path: "employee",
        component: EmployeeCenterComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: "",
                component: EmployeeMasterComponent,
            }
        ],
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(employeeRoutes)
    ],
    exports: [
        RouterModule
    ]
})

export class EmployeeRouters { }