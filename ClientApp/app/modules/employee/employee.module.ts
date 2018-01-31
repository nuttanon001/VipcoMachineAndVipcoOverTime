import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// 3rd party
import "hammerjs";
// component
import { EmployeeCenterComponent } from "../../components/employee/employee-center.component";
import { EmployeeEditComponent } from "../../components/employee/employee-edit.component";
import { EmployeeMasterComponent } from "../../components/employee/employee-master.component";
import { EmployeeViewComponent } from "../../components/employee/employee-view.component";
// module
import { EmployeeRouters } from "./employee.routing";
import {
    CustomMaterialModule, ValidationModule,
} from "../module.index";
// service
import { EmployeeService , EmployeeServiceCommunicate } from "../../services/employee/employee.service";
import { EmployeeGroupService } from "../../services/employee-group/employee-group.service";
import { EmployeeGroupMisService } from "../../services/employee-group/employee-group-mis.service";

@NgModule({
    declarations: [
        EmployeeCenterComponent,
        EmployeeMasterComponent,
        EmployeeViewComponent,
        EmployeeEditComponent,
    ],
    imports: [
        // angular
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        // custom
        CustomMaterialModule,
        ValidationModule,
        EmployeeRouters,
    ],
    providers: [
        EmployeeService,
        EmployeeServiceCommunicate,
        EmployeeGroupMisService,
        EmployeeGroupService,
    ]
})
export class EmployeeModule {
}