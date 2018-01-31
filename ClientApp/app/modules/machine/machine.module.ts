import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// 3rd party
import "rxjs/Rx";
import "hammerjs";
// component
import { MachineCenterComponent } from "../../components/machine/machine-center.component";
import { MachineMasterComponent } from "../../components/machine/machine-master.component";
import { MachineViewComponent } from "../../components/machine/machine-view.component";
import { MachineEditComponent } from "../../components/machine/machine-edit.component";
import { EmployeeDialogComponent } from "../../components/dialog/dialog.index";
// module
import { MachineRouters } from "./machine.routing";
import {
    CustomMaterialModule, ValidationModule,
} from "../module.index";
// services
import {
    MachineService, TypeMachineService,
    MachineServiceCommunicate, MachineHasOperatorService,
} from "../../services/service.index";

import { DataTableServiceCommunicate } from "../../services/data-table/data-table.service";
import { EmployeeService } from "../../services/employee/employee.service";

@NgModule({
    declarations: [
        MachineCenterComponent,
        MachineMasterComponent,
        MachineViewComponent,
        MachineEditComponent,
        // mark EmployeeDialogComponent,
    ],
    imports: [
        // angular
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        // custom
        CustomMaterialModule,
        ValidationModule,
        MachineRouters,
    ],
    exports: [
        // employeeDialogComponent
    ],
    providers: [
        MachineService,
        EmployeeService,
        TypeMachineService,
        MachineHasOperatorService,
        MachineServiceCommunicate,
        // dataTableServiceCommunicate,
    ],
})

export class MachineModule { }