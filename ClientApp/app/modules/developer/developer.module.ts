import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
// 3rd party
import "hammerjs";
import { AngularSplitModule } from "angular-split";

// component
import {
    DeveloperMachineComponent, DeveloperMasterComponent,
    DeveloperCenterComponent, DeveloperJobCardComponent,
    DeveloperMachineTypeComponent, MaterialComponent,
    ProjectcodeComponent, StandardTimeComponent,
    TaskMachineComponent
} from "../../components/developer/developer.index";
// module
import { DeveloperRouters } from "./developer.routing";
import { CustomMaterialModule } from "../module.index";
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
    declarations: [
        DeveloperCenterComponent,
        DeveloperMachineComponent,
        DeveloperMasterComponent,
        DeveloperJobCardComponent,
        DeveloperMachineTypeComponent,
        MaterialComponent,
        ProjectcodeComponent,
        StandardTimeComponent,
        TaskMachineComponent
    ],
    imports: [
        //Angular
        CommonModule,
        //3rd
        AngularSplitModule,
        NgxDatatableModule,
        //Custom
        CustomMaterialModule,
        DeveloperRouters,
    ],
})

export class DeveloperModule { }