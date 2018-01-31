import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// 3rd party
import "hammerjs";
// component
import { CuttingCenterComponent } from "../../components/cutting-plan/cutting-center.component";
import { CuttingMasterComponent } from "../../components/cutting-plan/cutting-master.component";
import { CuttingViewComponent } from "../../components/cutting-plan/cutting-view.component";
import { CuttingEditComponent } from "../../components/cutting-plan/cutting-edit.component";
import { ImportCsvComponent } from "../../components/cutting-plan/import-csv.component";
// module
import { CuttingPlanRouters } from "./cutting-plan.routing";
import {
    CustomMaterialModule, ValidationModule,
} from "../module.index";
// services
import {
    CuttingPlanService, MaterialService,
    CuttingPlanServiceCommunicate, DataTableServiceCommunicate
} from "../../services/service.index";
import { ProjectCodeDetailEditService } from "../../services/projectcode-detail/projectcode-detail-edit.service";

@NgModule({
    declarations: [
        CuttingCenterComponent,
        CuttingMasterComponent,
        CuttingViewComponent,
        CuttingEditComponent,
        ImportCsvComponent,
    ],
    imports: [
        //Angular
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        //Custom
        CustomMaterialModule,
        ValidationModule,
        CuttingPlanRouters,
    ],
    providers: [
        MaterialService,
        CuttingPlanService,
        ProjectCodeDetailEditService,
        CuttingPlanServiceCommunicate,
        // DataTableServiceCommunicate
    ],
    exports: [
        CuttingEditComponent,
    ]
})

export class CuttingPlanModule { }