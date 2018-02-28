import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// 3rd party
import "hammerjs";
// component
import { OverTimeEditComponent } from "../../components/task-machine/over-time-edit.component";
import { TaskMachineCenterComponent } from "../../components/task-machine/task-machine-center.component";
import { TaskMachineEditComponent } from "../../components/task-machine/task-machine-edit.component";
import { TaskMachineMasterComponent } from "../../components/task-machine/task-machine-master.component";
import { TaskMachineViewComponent } from "../../components/task-machine/task-machine-view.component";
import { TaskMachineScheduleComponent } from "../../components/task-machine/task-machine-schedule.component";
import { TaskMachineProgressComponent } from "../../components/task-machine/task-machine-progress.component";
import { TaskMachineChartComponent } from "../../components/task-machine/task-machine-chart.component";
import { TaskMacineLinkmailComponent } from "../../components/task-machine/task-macine-linkmail.component";
import { MachineScheduleComponent } from "../../components/task-machine/machine-schedule.component";
// module
import { TaskMachineRouters } from "./task-machine.routing";
import {
    CustomMaterialModule, ValidationModule,
} from "../module.index";
// services
import { TaskMachineHasOverTimeService } from "../../services/over-time/over-time.service";
import {
    TaskMachineService, JobCardMasterService,JobCardDetailService,
    TaskMachineServiceCommunicate,
} from "../../services/service.index";

@NgModule({
    declarations: [
        OverTimeEditComponent,
        TaskMachineCenterComponent,
        TaskMachineEditComponent,
        TaskMachineMasterComponent,
        TaskMachineViewComponent,
        TaskMachineScheduleComponent,
        TaskMachineProgressComponent,
        TaskMachineChartComponent,
        TaskMacineLinkmailComponent,
        MachineScheduleComponent
    ],
    imports: [
        // angular
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        // custom
        CustomMaterialModule,
        ValidationModule,
        TaskMachineRouters,
    ],
    providers: [
        TaskMachineService,
        JobCardMasterService,
        JobCardDetailService,
        // mark TaskMachineServiceCommunicate,
        TaskMachineHasOverTimeService,
    ]
})

export class TaskMachineModule { }