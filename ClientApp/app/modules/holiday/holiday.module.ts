import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// 3rd party
import "rxjs/Rx";
import "hammerjs";
// component
import { HolidayCenterComponent } from "../../components/holiday-overtime/holiday-center.component";
import { HolidayEditComponent } from "../../components/holiday-overtime/holiday-edit.component";
import { HolidayMasterComponent } from "../../components/holiday-overtime/holiday-master.component";
import { HolidayViewComponent } from "../../components/holiday-overtime/holiday-view.component";
// module
import { HolidayRoutingModule } from "./holiday.routing.module";
import {
    CustomMaterialModule, ValidationModule,
} from "../module.index";
// services
import {
    HolidayOverTimeService,
    HolidayOverTimeServiceCommunicate
} from "../../services/overtime-master/holiday-overtime.service";

@NgModule({
    declarations: [
        HolidayCenterComponent,
        HolidayEditComponent,
        HolidayMasterComponent,
        HolidayViewComponent,
    ],
    imports: [
        // angular
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        // custom
        CustomMaterialModule,
        ValidationModule,
        HolidayRoutingModule,
    ],
    exports: [],
    providers: [
        HolidayOverTimeService,
        HolidayOverTimeServiceCommunicate
        // dataTableServiceCommunicate,
    ],
})

export class HolidayModule { }