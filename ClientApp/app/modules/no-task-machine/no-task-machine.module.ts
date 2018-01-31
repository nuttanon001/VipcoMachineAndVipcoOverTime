import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// 3rd party
import "hammerjs";
// component
import { NoTaskMachineCenterComponent } from "../../components/no-task-machine/notask-machine-center.component"
import { NoTaskMachineEditComponent } from "../../components/no-task-machine/notask-machine-edit.component"
import { NoTaskMachineMasterComponent } from "../../components/no-task-machine/notask-machine-master.component"
import { NoTaskMachineViewComponent } from "../../components/no-task-machine/notask-machine-view.component"
// module
import { NoTaskMachineRoutingModule } from "./no-task-machine.routing";
import {
    CustomMaterialModule, ValidationModule,
} from "../module.index";
// services
import { TaskMachineHasOverTimeService } from "../../services/over-time/over-time.service";
import {
    TaskMachineService, JobCardMasterService, JobCardDetailService,
    TaskMachineServiceCommunicate,
} from "../../services/service.index";

@NgModule({
    declarations: [
        NoTaskMachineCenterComponent,
        NoTaskMachineEditComponent,
        NoTaskMachineMasterComponent,
        NoTaskMachineViewComponent,
    ],
    imports: [
        // angular
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        // custom
        CustomMaterialModule,
        ValidationModule,
        NoTaskMachineRoutingModule,
    ],
    providers: [
        TaskMachineService,
        JobCardDetailService,
        // mark TaskMachineServiceCommunicate,
    ]
})

export class NoTaskMachineModule { }