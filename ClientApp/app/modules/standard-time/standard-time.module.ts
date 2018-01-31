import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// 3rd party
import "rxjs/Rx";
import "hammerjs";
// component
import { StandardTimeCenterComponent } from "../../components/standard-time/standard-time-center.component";
import { StandardTimeEditComponent } from "../../components/standard-time/standard-time-edit.component";
import { StandardTimeMasterComponent } from "../../components/standard-time/standard-time-master.component";
import { StandardTimeViewComponent } from "../../components/standard-time/standard-time-view.component";
// module
import { StandardTimeRouters } from "./standard-time.routing";
import {
    CustomMaterialModule, ValidationModule,
} from "../module.index";
// services
import {
    TypeStandardTimeService, TypeStandardTimeServiceCommunicate,
    TypeMachineService,
} from "../../services/service.index";
import { StandardTimeService } from "../../services/standard-time/standard-time.service";

@NgModule({
    declarations: [
        StandardTimeCenterComponent,
        StandardTimeMasterComponent,
        StandardTimeViewComponent,
        StandardTimeEditComponent,
    ],
    imports: [
        //Angular
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        //Custom
        CustomMaterialModule,
        ValidationModule,
        StandardTimeRouters,
    ],
    providers: [
        TypeMachineService,
        StandardTimeService,
        TypeStandardTimeService,
        TypeStandardTimeServiceCommunicate,
    ],
})

export class StandardTimeModule { }